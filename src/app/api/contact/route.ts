import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createSubmission } from '@/lib/sqlite';
import { connectToDatabase } from '@/lib/mongodb';
import { Submission } from '@/models/Submission';
import { checkRateLimit } from '@/lib/rate-limit';
import { Resend } from 'resend';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(120),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(7, 'Phone number must be at least 7 digits').max(25),
  service: z.string().default('general'),
  message: z.string().min(5, 'Message must be at least 5 characters').max(3000),
  locale: z.enum(['en', 'ar']).default('en'),
  source: z.string().default('contact-page'),
  honeypot: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    // 1. IP Rate Limiting (5 requests per minute)
    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      req.headers.get('x-real-ip') ||
      '127.0.0.1';

    const rateLimit = checkRateLimit(ip, 5, 60000);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: 'Too many requests. Please wait a minute before submitting again.',
        },
        { status: 429 }
      );
    }

    // 2. Parse & Validate Payload
    const body = await req.json();
    const parsed = contactSchema.safeParse(body);

    if (!parsed.success) {
      const errorMsg = parsed.error.issues.map((i) => i.message).join(', ');
      return NextResponse.json(
        { success: false, error: errorMsg },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // 3. Honeypot check: Silent drop if bot filled out hidden field
    if (data.honeypot && data.honeypot.trim() !== '') {
      return NextResponse.json({ success: true, message: 'Received' });
    }

    // 4. Save to SQLite Database (Local persistence)
    let savedSubmissionId = null;
    try {
      const sqliteSub = createSubmission({
        name: data.name,
        email: data.email,
        phone: data.phone,
        service: data.service,
        message: data.message,
        locale: data.locale,
        source: data.source,
      });
      savedSubmissionId = sqliteSub.id;
    } catch (sqliteErr) {
      console.error('SQLite submission save error:', sqliteErr);
    }

    // Optional MongoDB fallback / mirror if configured
    try {
      const db = await connectToDatabase();
      if (db) {
        await Submission.create({
          name: data.name,
          email: data.email,
          phone: data.phone,
          service: data.service,
          message: data.message,
          locale: data.locale,
          source: data.source,
          status: 'new',
        });
      }
    } catch (dbError) {
      // Ignored if client hasn't provided MongoDB credentials yet
    }

    // 5. Send Email via Resend if API key is configured
    const resendApiKey = process.env.RESEND_API_KEY;
    if (resendApiKey) {
      try {
        const resend = new Resend(resendApiKey);
        const adminEmail = process.env.ADMIN_EMAIL || 'chhameed@greensolutionksa.com';

        await resend.emails.send({
          from: 'Green Solution Lead <onboarding@resend.dev>',
          to: adminEmail,
          subject: `Green Solution Consultation Lead: ${data.name} (${data.service})`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
              <h2 style="color: #16332A; border-bottom: 2px solid #8DC63F; padding-bottom: 10px;">New Consultation Request</h2>
              <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
                <tr><td style="padding: 8px; font-weight: bold; color: #555;">Name:</td><td style="padding: 8px;">${data.name}</td></tr>
                <tr><td style="padding: 8px; font-weight: bold; color: #555;">Phone:</td><td style="padding: 8px;"><a href="tel:${data.phone}">${data.phone}</a></td></tr>
                <tr><td style="padding: 8px; font-weight: bold; color: #555;">Email:</td><td style="padding: 8px;"><a href="mailto:${data.email}">${data.email}</a></td></tr>
                <tr><td style="padding: 8px; font-weight: bold; color: #555;">Service:</td><td style="padding: 8px; font-weight: bold; color: #3E7D3E;">${data.service}</td></tr>
                <tr><td style="padding: 8px; font-weight: bold; color: #555;">Locale:</td><td style="padding: 8px;">${data.locale.toUpperCase()}</td></tr>
                <tr><td style="padding: 8px; font-weight: bold; color: #555;">Source:</td><td style="padding: 8px;">${data.source}</td></tr>
              </table>
              <div style="margin-top: 20px; padding: 15px; background: #F7F9F5; border-radius: 8px;">
                <strong>Message:</strong>
                <p style="margin-top: 8px; line-height: 1.6; color: #333;">${data.message}</p>
              </div>
              <p style="margin-top: 20px; font-size: 12px; color: #888;">Submitted via Green Solution KSA Portal</p>
            </div>
          `,
        });
      } catch (emailError) {
        console.error('Resend notification error:', emailError);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Submission successfully received',
      id: savedSubmissionId,
    });
  } catch (error: any) {
    console.error('API Contact route error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
