import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Política de Privacidad",
  description:
    "Política de privacidad y tratamiento de datos personales de OMODA | JAECOO Uruguay, conforme a la Ley N° 18.331.",
  alternates: { canonical: "/politica-de-privacidad" },
  robots: { index: true, follow: true },
};

export default function PoliticaDePrivacidadPage() {
  return (
    <main id="main-content" className="min-h-screen">
      <Navbar />

      <section className="pt-40 pb-20 md:pt-48 md:pb-28">
        <div className="container-custom max-w-3xl">
          <h1 className="text-section font-michroma font-bold text-white uppercase mb-8 leading-tight">
            Política de Privacidad
          </h1>

          <div className="prose prose-invert prose-sm sm:prose-base max-w-none space-y-6 text-text-secondary leading-relaxed">
            <p className="text-sm italic text-text-muted border-l-2 border-accent pl-4">
              Lea esto con detenimiento. Este documento indica como DARLAX
              COMPANY S.A., sociedad uruguaya debidamente inscripta en el
              Registro Único Tributario con el número 219030350011, y sus
              empresas afiliadas, vinculadas o relacionadas utilizarán y
              protegerán sus datos personales. Al proporcionar sus datos
              personales usted automáticamente acepta las normas de uso,
              protección y seguridad aquí establecidas.
            </p>

            <Section title="1. Protección de Datos">
              <p>
                Agradecemos tu visita a nuestro sitio web y tu interés en los
                productos que ofrecemos. Proteger tus datos personales es muy
                importante para nosotros. En esta Política de Privacidad
                explicamos cómo recopilamos tu información personal, qué hacemos
                con ella, con qué fines y sobre qué base legal, así como los
                derechos que te asisten. También nos referimos a la Política de
                Protección de Datos de OMODA | JAECOO.
              </p>
              <p>
                Nuestra Política de Privacidad sobre el uso de nuestros sitios
                web y la Política de Protección de Datos de OMODA | JAECOO no
                aplica a las actividades realizadas en otros sitios web o redes
                sociales, u otros proveedores a los que se accede a través de
                enlaces en nuestros sitios. Por favor, lee las políticas de
                protección de datos de dichos proveedores.
              </p>
            </Section>

            <Section title="2. Su privacidad. Seguridad y protección de sus datos personales">
              <p>
                OMODA | JAECOO respeta su privacidad. Toda la información que
                usted nos proporcione se tratará con sumo cuidado y con la mayor
                seguridad posible, y sólo se utilizará de acuerdo con los
                límites establecidos en este documento y de conformidad con la
                ley N° 18.331. La seguridad de los datos personales es una
                prioridad para OMODA | JAECOO. Este sitio web se esfuerza por
                ofrecer el más alto nivel de seguridad para lo cual se utiliza
                tecnología de avanzada. No obstante, considerando el estado de
                la tecnología de transmisión de datos por Internet, ningún
                sistema resulta actualmente 100% seguro o libre de ataques.
              </p>
            </Section>

            <Section title="3. Cómo se reúne la información">
              <p>
                <strong>a.</strong> Cada vez que visitas nuestros sitios web,
                almacenamos cierta información sobre el navegador y sistema
                operativo que utilizas; la fecha y hora de tu visita; el estado
                de la interacción (por ejemplo, si pudiste acceder al sitio o si
                recibiste un mensaje de error); el uso de funciones del sitio;
                términos de búsqueda ingresados; frecuencia de visita a páginas
                individuales; nombres de los archivos a los que accedes;
                cantidad de datos transferidos; la página desde la que
                accediste a nuestro sitio; y la página a la que accedes
                después, ya sea mediante enlaces o introduciendo un dominio
                directamente en el navegador. Además, almacenamos tu dirección
                IP y el nombre de tu proveedor de servicios de Internet durante
                siete días, por razones de seguridad —en particular, para
                prevenir y detectar ataques o intentos de fraude—.
              </p>
              <p>
                <strong>b.</strong> Solo procesamos otros datos personales si
                los proporcionas voluntariamente, por ejemplo, en una
                registración, formulario de contacto, chat, encuesta, concurso
                o para ejecutar un contrato, y únicamente en la medida permitida
                por tu consentimiento o por la normativa aplicable.
              </p>
              <p>
                <strong>c.</strong> No estás legal ni contractualmente obligado
                a proporcionar tus datos personales. Sin embargo, ciertas
                funciones del sitio pueden depender de ello. Si no los
                proporcionas, podrías no poder usar algunas funciones o solo
                hacerlo de manera limitada.
              </p>
            </Section>

            <Section title="4. Cómo utiliza su información OMODA | JAECOO">
              <p>
                OMODA | JAECOO utiliza la información que usted proporciona con
                los siguientes fines:
              </p>
              <ul className="list-none space-y-2 pl-0">
                <li>
                  <strong>(i)</strong> Para expandir ofertas de comercialización
                  y para publicar productos y servicios que podrían ser de su
                  interés, incluso para recuperación o reemplazo de partes y
                  componentes;
                </li>
                <li>
                  <strong>(ii)</strong> Para personalizar y mejorar nuestros
                  productos y servicios;
                </li>
                <li>
                  <strong>(iii)</strong> Para fines estadísticos de OMODA |
                  JAECOO;
                </li>
                <li>
                  <strong>(iv)</strong> Para campañas publicitarias y/o de
                  marketing tendientes a mantenerlo actualizado sobre nuestros
                  productos, promociones y/o distintos servicios ofrecidos por
                  OMODA | JAECOO y/o por su Red Oficial y/o Talleres Oficiales,
                  pudiendo contactarlo a través de correo electrónico, teléfono,
                  SMS, WhatsApp u otras aplicaciones de mensajería y/o correo
                  postal conforme a los datos por usted proporcionados;
                </li>
                <li>
                  <strong>(v)</strong> Para poder cumplir con las obligaciones
                  que correspondan en los términos de la garantía sobre
                  vehículo;
                </li>
                <li>
                  <strong>(vi)</strong> Para medir el grado de satisfacción de
                  los clientes.
                </li>
              </ul>
            </Section>

            <Section title="5. ¿Quién tiene acceso a la información?">
              <p>
                OMODA | JAECOO siempre está comprometida a presentar nuevas
                soluciones que mejoren el valor de sus productos y servicios
                para ofrecerle a usted oportunidades especiales de
                comercialización, tales como incentivos y promociones. Para
                alcanzar esa meta, su información podrá ser compartida con
                algunos de nuestros socios comerciales, tales como:
              </p>
              <ul className="list-none space-y-2 pl-0">
                <li>
                  <strong>(i)</strong> empresas del grupo OMODA | JAECOO,
                </li>
                <li>
                  <strong>(ii)</strong> Red de concesionarios y talleres
                  oficiales,
                </li>
                <li>
                  <strong>(iii)</strong> Agencias de Publicidad, y/o de eventos
                  y/o de promociones y/o que realice cualquier otra acción de
                  marketing por encargo de OMODA | JAECOO;
                </li>
                <li>
                  <strong>(iv)</strong> Empresas que provean a OMODA | JAECOO
                  cualquier tipo de servicios informáticos y/o de archivo de
                  información electrónica y/o física;
                </li>
                <li>
                  <strong>(v)</strong> Empresas que operen su Centro de Atención
                  al Cliente;
                </li>
                <li>
                  <strong>(vi)</strong> Empresa que ofrezca líneas de crédito o
                  financiación para sus productos; pudiendo dichas empresas
                  localizar la base de datos en Uruguay o en terceros países.
                  OMODA | JAECOO toma todas las medidas posibles para que tales
                  empresas traten su información respetando la misma política de
                  privacidad que tiene OMODA | JAECOO.
                </li>
              </ul>
              <p>
                La información no identificable y estadística también podrá ser
                compartida con socios comerciales.
              </p>
              <p>
                A excepción de los casos anteriores, OMODA | JAECOO no
                compartirá información que podría identificar personalmente a
                sus clientes.
              </p>
            </Section>

            <Section title="6. ¿Cómo desea que se utilice la información?">
              <p>
                Al proporcionar sus datos personales, usted está autorizando
                automáticamente a OMODA | JAECOO a utilizarlos de acuerdo con
                esta Política de Seguridad y Privacidad. Cuando solicita
                información, OMODA | JAECOO le pregunta a usted cómo desea que
                se utilice su información para la comunicación futura con OMODA
                | JAECOO y con sus socios comerciales. En ese momento, si no
                está de acuerdo con la propuesta de uso que sugiere OMODA |
                JAECOO, usted podrá desactivar las opciones no deseadas con un
                clic en el ícono correspondiente. Si elige mantener activadas
                las opciones, automáticamente usted estará autorizando a OMODA
                | JAECOO a utilizar sus datos personales para recibir
                correspondencia futura de las empresas de OMODA | JAECOO o sus
                socios comerciales.
              </p>
            </Section>

            <Section title="7. Finalidad de uso">
              <p>
                <strong>a.</strong> Los datos recopilados durante tu visita a
                nuestros sitios se utilizan para hacer su uso más conveniente y
                para proteger nuestros sistemas IT contra ataques u actividades
                ilícitas.
              </p>
              <p>
                <strong>b.</strong> Si compartes información adicional mediante
                un registro, formulario u otra vía, la utilizaremos para los
                fines indicados, para la gestión de clientes y, si corresponde,
                para el procesamiento contractual y facturación.
              </p>
              <p>
                <strong>c.</strong> Para otros fines (por ejemplo, mostrar
                contenido personalizado o publicidad basada en tu
                comportamiento), solo la utilizamos si otorgas tu consentimiento
                mediante nuestro sistema de gestión de consentimiento.
              </p>
              <p>
                <strong>d.</strong> También utilizamos datos personales cuando
                existe una obligación legal (por ejemplo, conservar
                documentación comercial o fiscal, o cumplir con exigencias de
                autoridades judiciales o gubernamentales).
              </p>
            </Section>

            <Section title="8. Cookies">
              <p>
                Una cookie es un pequeño archivo que se descarga en tu
                computadora o dispositivo móvil (como, por ejemplo, smartphone
                o tablet) al acceder a un sitio web. Las cookies propias y de
                terceros nos permiten mejorar nuestros servicios.
              </p>
              <p>
                Al navegar por nuestro sitio web, aceptas el uso que hacemos de
                las cookies que se detalla a continuación.
              </p>
              <p>
                Mediante el uso de las cookies resulta posible que el servidor
                donde se encuentra la web, reconozca el navegador web utilizado
                por el usuario con la finalidad de que la navegación sea más
                sencilla y eficaz.
              </p>
              <p>
                Las cookies utilizadas por el sitio web de OMODA | JAECOO están
                destinadas a identificar las tendencias de navegación del
                usuario, buscando mejorar y personalizar su acceso en el
                futuro, tales como páginas o enlaces navegados por clic.
                También están destinadas a recordar la información que se ha
                introducido previamente en cualquier formulario.
              </p>
              <p>
                Se utilizan también para medir la audiencia y parámetros del
                tráfico, el progreso y número de entradas, para fines
                estadísticos de OMODA | JAECOO y para campañas publicitarias
                y/o de marketing tendientes a mantenerte actualizado sobre
                nuestros productos, promociones y/o distintos servicios
                ofrecidos por OMODA | JAECOO y/o por su Red Oficial y/o
                Talleres Oficiales.
              </p>
              <p>
                Las cookies utilizadas por el sitio web se asocian únicamente
                con un usuario anónimo y su computadora, y no proporcionan por
                sí mismas los datos personales del usuario.{" "}
                <strong>Revocación y eliminación de cookies:</strong> Puedes
                permitir, bloquear o eliminar las cookies instaladas en tu
                equipo mediante la configuración de las opciones del navegador
                instalado en tu computador. Tenga presente que, en caso de que
                no permita la instalación de cookies en su navegador, es
                posible que no pueda acceder a alguna de las secciones de
                nuestra web.
              </p>
            </Section>

            <Section title="9. Seguridad">
              <p>
                Tomamos medidas de seguridad técnicas y organizativas para
                proteger tu información gestionada por nosotros contra
                manipulación, pérdida, destrucción o acceso por parte de
                personas no autorizadas.
              </p>
              <p>
                Mejoramos continuamente nuestras medidas de seguridad en línea
                con los avances tecnológicos.
              </p>
            </Section>

            <Section title="10. Eliminación de datos">
              <p>
                Tu dirección IP y el nombre de tu proveedor de servicios de
                Internet, que almacenamos por razones de seguridad, se eliminan
                después de siete días. Además, eliminamos tu información
                personal tan pronto como se haya cumplido el propósito para el
                cual fue recopilada y procesada.
              </p>
              <p>
                Después de ese período, el almacenamiento de datos solo se
                realiza en la medida en que lo exijan las leyes, reglamentos u
                otras disposiciones legales a las que estamos sujetos, o por
                disposiciones legales en países terceros si estos cuentan con
                un nivel adecuado de protección de datos.
              </p>
              <p>
                Si en casos individuales no fuera posible eliminar los datos,
                los datos personales correspondientes se marcarán para
                restringir su procesamiento posterior.
              </p>
            </Section>

            <Section title="11. Derechos del interesado">
              <p>
                Como titular de los datos afectados por el procesamiento,
                tienes derecho a:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Información (Artículo 13 de la Ley Nro. 18.331)</li>
                <li>Acceso (Artículo 14 de la Ley Nro. 18.331)</li>
                <li>Rectificación (Artículo 15 de la Ley Nro. 18.331)</li>
                <li>Supresión (Artículo 15 de la Ley Nro. 18.331)</li>
              </ul>
              <p>
                Si has dado tu consentimiento para que procesemos tu información
                personal, tienes derecho a revocarlo en cualquier momento.
              </p>
              <p>
                Tu revocación no afecta la legalidad del procesamiento realizado
                antes de que el consentimiento fuese retirado. Tampoco afecta el
                procesamiento posterior de la información cuando exista otra
                base legal, como el cumplimiento de obligaciones legales.
              </p>
            </Section>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="pt-6">
      <h2 className="text-lg md:text-xl font-semibold text-white mb-3 scroll-mt-24">
        {title}
      </h2>
      <div className="space-y-3 text-sm sm:text-base">{children}</div>
    </section>
  );
}
