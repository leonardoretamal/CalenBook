'use server';

import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '465'),
  secure: process.env.SMTP_PORT === '465', // true for 465, false for 587
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendBookingConfirmationEmail({
  guestEmail,
  guestName,
  startTime,
  scheduleName,
  bookingId,
}: {
  guestEmail: string;
  guestName: string;
  startTime: string;
  scheduleName: string;
  bookingId: string;
}) {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn(
      'SMTP_USER o SMTP_PASS no configurado. Omitiendo envío de correo.'
    );
    return { success: false, error: 'Configuración de correo incompleta' };
  }

  const confirmLink = `${process.env.NEXT_PUBLIC_APP_URL}/api/bookings/confirm/${bookingId}`;

  try {
    await transporter.verify(); // Test connection

    const result = await transporter.sendMail({
      from: `"CalenBook" <${process.env.SMTP_USER}>`,
      to: guestEmail,
      subject: `Confirmación requerida: ${scheduleName}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
          <h1 style="color: #0f172a; font-size: 24px;">¡Hola ${guestName}!</h1>
          <p style="color: #475569; font-size: 16px; line-height: 1.5;">
            Has solicitado una reserva para <strong>${scheduleName}</strong> el <strong>${startTime}</strong>.
          </p>
          
          <p style="color: #475569; font-size: 16px; line-height: 1.5;">
            Para finalizar la reserva y añadirla a tu calendario, por favor haz clic en el siguiente botón:
          </p>

          <div style="text-align: center; margin: 32px 0;">
            <a href="${confirmLink}" style="background-color: #0f172a; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold; display: inline-block;">
              Confirmar Cita
            </a>
          </div>

          <p style="color: #64748b; font-size: 14px;">
            Si no solicitaste esta reserva, puedes ignorar este correo.
          </p>

          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 32px 0;" />
          
          <p style="color: #94a3b8; font-size: 12px; text-align: center;">
            Enviado por CalenBook - Gestión de Reservas Profesionales
          </p>
        </div>
      `,
    });

    console.log('Email enviado con éxito:', result.messageId);
    return { success: true, id: result.messageId };
  } catch (error: any) {
    console.error('Error enviando email con Nodemailer:', error);
    return { success: false, error: error?.message || 'Error desconocido' };
  }
}
