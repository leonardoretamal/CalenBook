import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Shield, Eye, Lock, Trash2 } from 'lucide-react';
import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-muted/20 pb-20">
      <div className="bg-background border-b py-6 px-4">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            asChild
            className="cursor-pointer"
          >
            <Link href="/">
              <ChevronLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">
            Política de Privacidad
          </h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 mt-8 space-y-8">
        <Card className="glass border-primary/10 shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-2 text-primary mb-2">
              <Shield className="h-5 w-5" />
              <span className="text-sm font-semibold uppercase tracking-wider">
                Cumplimiento Ley 19.628
              </span>
            </div>
            <CardTitle className="text-3xl font-bold font-heading">
              Protegiendo tus Datos Personales
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-slate dark:prose-invert max-w-none space-y-6 text-muted-foreground leading-relaxed">
            <p>
              En <strong>CalenBook</strong>, nos tomamos muy en serio la
              privacidad y la protección de los datos personales de nuestros
              usuarios (propietarios y clientes), en estricto cumplimiento con
              la <strong>Ley N° 19.628</strong> sobre Protección de la Vida
              Privada en Chile.
            </p>

            <div className="grid md:grid-cols-2 gap-6 not-prose">
              <div className="bg-background/50 p-4 rounded-xl border border-primary/5">
                <div className="flex items-center gap-2 text-foreground font-semibold mb-2">
                  <Eye className="h-4 w-4 text-primary" />
                  ¿Qué datos recolectamos?
                </div>
                <ul className="text-sm space-y-2 list-disc pl-4">
                  <li>
                    <strong>Propietarios:</strong> Nombre completo, correo
                    electrónico y configuración de agendas.
                  </li>
                  <li>
                    <strong>Clientes:</strong> Nombre completo, correo
                    electrónico y notas de reserva.
                  </li>
                  <li>
                    <strong>Google:</strong> Solo tokens de acceso si decides
                    sincronizar tu calendario.
                  </li>
                </ul>
              </div>
              <div className="bg-background/50 p-4 rounded-xl border border-primary/5">
                <div className="flex items-center gap-2 text-foreground font-semibold mb-2">
                  <Lock className="h-4 w-4 text-primary" />
                  ¿Para qué los usamos?
                </div>
                <p className="text-sm">
                  La recolección de datos tiene la única finalidad de facilitar
                  la gestión de citas, el envío de correos de confirmación y la
                  sincronización con calendarios personales.{' '}
                  <strong>
                    No vendemos ni compartimos tus datos con terceros.
                  </strong>
                </p>
              </div>
            </div>

            <h3 className="text-xl font-bold text-foreground mt-8">
              Tus Derechos ARCO
            </h3>
            <p>
              La ley chilena te otorga el derecho de Acceso, Rectificación,
              Cancelación y Oposición. En CalenBook, esto significa que:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                Puedes consultar tus datos en cualquier momento desde tu perfil.
              </li>
              <li>Puedes corregir información errónea.</li>
              <li>
                <strong>Derecho al Olvido:</strong> Puedes eliminar tu cuenta de
                forma autónoma desde los ajustes, lo cual borrará
                permanentemente toda tu información de nuestros servidores (no
                hacemos "soft-delete").
              </li>
            </ul>

            <div className="bg-destructive/5 border border-destructive/20 p-4 rounded-xl flex items-start gap-3 mt-8">
              <Trash2 className="h-5 w-5 text-destructive mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-destructive">
                  Eliminación Permanente
                </p>
                <p className="text-xs text-destructive/80 leading-snug">
                  Al solicitar la eliminación de tu cuenta como propietario, se
                  borrarán todos tus datos, agendas y registros de reservas de
                  terceros asociados a ti sin posibilidad de recuperación.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground pb-10">
          Última actualización: Marzo 2026. CalenBook - Chile.
        </p>
      </div>
    </div>
  );
}
