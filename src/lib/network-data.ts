/**
 * Red de distribución y servicio OMODA | JAECOO Uruguay.
 * Concesionarios y talleres autorizados.
 * Source: omodajaecoo.com.uy/concesionarios | /talleres
 */

export interface NetworkLocation {
  name: string;
  department: string;
  city?: string;
  address: string;
  phone: string;
  email: string;
  contact?: string;
  hours?: string;
}

// ---------------------------------------------------------------------------
// Concesionarios
// ---------------------------------------------------------------------------
export const CONCESIONARIOS: NetworkLocation[] = [
  {
    name: "Omoda-Jaecoo Santa Rosa",
    department: "Montevideo",
    address: "Galicia 908",
    phone: "099 100 331",
    email: "omoda-jaecoo@santarosa.com.uy",
    hours: "Lunes a Viernes 9:00–18:30",
  },
  {
    name: "Olivera Automotores",
    department: "Montevideo",
    address: "Av. Italia 5147",
    phone: "099 234 036",
    email: "hortencia.oliveraautomotores@gmail.com",
    contact: "Hortencia Benitez",
  },
  {
    name: "Oscar Pisano",
    department: "Montevideo",
    address: "Av. Millán 4328",
    phone: "098 501 859",
    email: "oscar@oscarpisano.com",
    contact: "Oscar Pisano",
  },
  {
    name: "Car One",
    department: "Canelones",
    address: "Interbalnearia esq. Camino de los Horneros",
    phone: "099 100 331",
    email: "omoda-jaecoo@santarosa.com.uy",
  },
  {
    name: "Canepa",
    department: "Canelones",
    city: "Pando",
    address: "Franklin Delano Roosevelt 830",
    phone: "097 822 288",
    email: "mcanepa@canepas.com.uy",
    contact: "Martin Canepa",
  },
  {
    name: "Moreira",
    department: "Canelones",
    city: "Las Piedras",
    address: "Av. Dr. Enrique Pouey esq. Manuel Freire",
    phone: "095 692 064",
    email: "imoreira@moreiraautomoviles.com.uy",
    contact: "Ignacio Moreira",
  },
  {
    name: "Daniel Morales",
    department: "Canelones",
    city: "San Jacinto",
    address: "José Artigas s/n",
    phone: "097 347 652",
    email: "todolar.sa@gmail.com",
    contact: "Daniel Morales",
  },
  {
    name: "Orsi Automotores",
    department: "Canelones",
    city: "Santa Lucía",
    address: "Sarandí esquina Santa Lucía",
    phone: "091 404 494",
    email: "orsiautomoviles@gmail.com",
    contact: "Karina Orsi",
  },
  {
    name: "Alfalider",
    department: "Maldonado",
    address: "Pascual Gattas y San Francisco",
    phone: "095 589 163",
    email: "avaya@alfalider.com.uy",
    contact: "Alejandro Vaya",
  },
  {
    name: "Luis Bentancor",
    department: "Maldonado",
    city: "Playa Verde",
    address: "Ruta 10 km 91.800",
    phone: "099 712 375",
    email: "luisbentancor12@gmail.com",
    contact: "Luis Bentancor",
  },
  {
    name: "Julio Automoviles",
    department: "Rocha",
    address: "José P. Ramírez 226",
    phone: "099 660 713",
    email: "auprado@internet.com.uy",
    contact: "Julio Rodríguez",
  },
  {
    name: "Oscar Pisano",
    department: "San José",
    address: "Av. José Pedro Varela 3698",
    phone: "098 501 859",
    email: "oscar@oscarpisano.com",
    contact: "Oscar Pisano",
  },
  {
    name: "Lafor Automotores",
    department: "Durazno",
    address: "Arquitecto Juan Jacinto Apolo",
    phone: "095 603 039",
    email: "florencialafor@gmail.com",
    contact: "Florencia Rodríguez",
  },
  {
    name: "Wohler Automotores",
    department: "Florida",
    address: "Wilson Ferreira Aldunate s/n esq. Ruta 5",
    phone: "099 353 811",
    email: "ventas@wohlerautomoviles.com.uy",
    contact: "Miguel Wohler",
  },
  {
    name: "Automotora Tarariras",
    department: "Colonia",
    city: "Tarariras",
    address: "Ruta 22 km 36",
    phone: "099 574 296",
    email: "aristeguie@hotmail.com",
    contact: "Eduardo Aristegui",
  },
  {
    name: "Autostore",
    department: "Colonia",
    address: "Aparicio Saravia y Av. Gonzales",
    phone: "",
    email: "gaston.muras@autostore.com.uy",
    contact: "Gaston Muras",
  },
  {
    name: "Wave Automotores",
    department: "Paysandú",
    address: "Setembrino Pereda 975",
    phone: "099 377 536",
    email: "jfort@waveautomotores.com.uy",
    contact: "Jorge Fort",
  },
  {
    name: "Olivera Automotores",
    department: "Salto",
    address: "Gobernador José Joaquín de Viana 1421",
    phone: "099 234 036",
    email: "hortencia.oliveraautomotores@gmail.com",
    contact: "Hortencia Benitez",
  },
  {
    name: "Oyarzabal Automotores",
    department: "Tacuarembó",
    address: "Angela B. de López 608",
    phone: "099 157 805",
    email: "automovilesoyarzabal@gmail.com",
    contact: "Ramiro Oyarzabal",
  },
  {
    name: "Horizonte Automóviles",
    department: "Rivera",
    address: "Joaquín Suárez 767",
    phone: "095 824 462",
    email: "yacksoncarneiro@gmail.com",
    contact: "Dany Silveira",
  },
  {
    name: "Bypass Automotores",
    department: "Artigas",
    address: "Bypass de Ruta 30, 164",
    phone: "099 772 400",
    email: "bypassautomotores@gmail.com",
    contact: "Diego Moreno",
  },
];

// ---------------------------------------------------------------------------
// Talleres
// ---------------------------------------------------------------------------
export const TALLERES: NetworkLocation[] = [
  {
    name: "Pisano",
    department: "Montevideo",
    address: "Av. Millán 4328",
    phone: "099 756 025",
    email: "posventa@oscarpisano.com",
    contact: "Fabio Martínez",
  },
  {
    name: "Santa Rosa - Galicia",
    department: "Montevideo",
    address: "Galicia 957",
    phone: "092 410 303",
    email: "fdelossantos@santarosa.com.uy",
    contact: "Florencia De Los Santos",
  },
  {
    name: "Canepa",
    department: "Canelones",
    city: "Pando",
    address: "Presidente Franklin Delano Roosevelt 830",
    phone: "2292 3344 / 097 822 542",
    email: "administracion@canepas.com.uy",
    contact: "Omar Canepas",
  },
  {
    name: "Car One",
    department: "Canelones",
    address: "Interbalnearia esq. Camino de los Horneros",
    phone: "2288 0014",
    email: "omoda-jaecoo@santarosa.com.uy",
  },
  {
    name: "Moreira Las Piedras",
    department: "Canelones",
    city: "Las Piedras",
    address: "Av. Dr. Enrique Pouey 789",
    phone: "093 681 547",
    email: "moreiracervicelp@moreiraautomoviles.com.uy",
    contact: "Cecilia Cámpora",
  },
  {
    name: "Taller TC",
    department: "Canelones",
    address: "Ruta Interbalnearia Gral. Líber Seregni km 48",
    phone: "099 314 608",
    email: "sennasa24@gmail.com",
    contact: "Valentina Abelenda",
  },
  {
    name: "Alfa Lider",
    department: "Maldonado",
    city: "Punta del Este",
    address: "Pascual Gattas 20100",
    phone: "095 589 163",
    email: "avaya@alfalider.com.uy",
    contact: "Alejandro Vaya",
  },
  {
    name: "Taller Agustín Benítez",
    department: "Maldonado",
    address: "Málaga, 20000 Maldonado",
    phone: "095 662 222",
    email: "benitezmotorsport@hotmail.com",
    contact: "Agustín Benítez",
  },
  {
    name: "Juan Pablo Vicente",
    department: "Rocha",
    address: "Ruta 9 km 209",
    phone: "099 870 577",
    email: "electrocevi@hotmail.com",
    contact: "Pablo Vicente",
  },
  {
    name: "Mecánica J. Rodríguez",
    department: "Lavalleja",
    city: "Minas",
    address: "Intendente Lois 30000",
    phone: "099 082 729",
    email: "tallerjrodriguez@hotmail.com",
    contact: "Rodolfo Rodríguez",
  },
  {
    name: "Drive Florida (Wohler)",
    department: "Florida",
    address: "Wilson Ferreira Aldunate s/n",
    phone: "091 228 305 / 4352 0466",
    email: "driveflorida@vera.com.uy",
    contact: "Kevin Wohler",
  },
  {
    name: "Automecanica AC",
    department: "Cerro Largo",
    address: "Juana de Ibarbourou 760",
    phone: "4643 4358",
    email: "automecanicaac@hotmail.com",
    contact: "Alejandro Cuello",
  },
  {
    name: "QS Motors",
    department: "Treinta y Tres",
    address: "Juan Antonio Lavalleja 1582",
    phone: "099 932 297",
    email: "tallerqsmotors33@gmail.com",
    contact: "Federico Quintela",
  },
  {
    name: "Talleres Klüver",
    department: "Soriano",
    address: "Ruta 2 km 276.500",
    phone: "098 951 606",
    email: "reset@kluver.com.uy",
    contact: "Sebastian Romero",
  },
  {
    name: "Videsol",
    department: "Colonia",
    address: "Italia 771",
    phone: "099 522 907",
    email: "walter.bonavetti@gmail.com",
    contact: "Walter Bonavetti",
  },
  {
    name: "Margalef",
    department: "Paysandú",
    address: "Colón, 60000 Paysandú",
    phone: "094 509 050",
    email: "tallerautomotriz@vera.com.uy",
    contact: "Pablo Margalef",
  },
  {
    name: "CSR",
    department: "Salto",
    address: "8 de Octubre 724",
    phone: "099 736 301",
    email: "csrcarperformance@gmail.com",
    contact: "Claudio Silva",
  },
  {
    name: "Mecánica PintoF",
    department: "Tacuarembó",
    address: "Atanasio Lapido 230 bis",
    phone: "098 059 663",
    email: "mecanicapintotbo@gmail.com",
    contact: "Juan Pinto",
  },
  {
    name: "Taller Elguy",
    department: "Rivera",
    address: "José María Beis 121",
    phone: "4625 3631 / 092 322 346",
    email: "elguymecanica@gmail.com",
    contact: "Leandro Elguy",
  },
];

// Sorted unique departments for filter UI
export const CONCESIONARIO_DEPARTMENTS = [
  ...new Set(CONCESIONARIOS.map((c) => c.department)),
].sort();

export const TALLER_DEPARTMENTS = [
  ...new Set(TALLERES.map((t) => t.department)),
].sort();
