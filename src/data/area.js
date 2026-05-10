// data/areas.js

export const bangladeshCities = [
  // Dhaka Metropolitan
  { name: "Dhaka", insideDhaka: true },

  // Dhaka Division
  { name: "Gazipur", insideDhaka: false },
  { name: "Narayanganj", insideDhaka: false },
  { name: "Tangail", insideDhaka: false },
  { name: "Kishoreganj", insideDhaka: false },
  { name: "Manikganj", insideDhaka: false },
  { name: "Munshiganj", insideDhaka: false },
  { name: "Narsingdi", insideDhaka: false },
  { name: "Faridpur", insideDhaka: false },
  { name: "Gopalganj", insideDhaka: false },
  { name: "Madaripur", insideDhaka: false },
  { name: "Rajbari", insideDhaka: false },
  { name: "Shariatpur", insideDhaka: false },

  // Chattogram Division
  { name: "Chattogram", insideDhaka: false },
  { name: "Cox's Bazar", insideDhaka: false },
  { name: "Comilla", insideDhaka: false },
  { name: "Feni", insideDhaka: false },
  { name: "Noakhali", insideDhaka: false },
  { name: "Brahmanbaria", insideDhaka: false },
  { name: "Rangamati", insideDhaka: false },
  { name: "Bandarban", insideDhaka: false },
  { name: "Khagrachari", insideDhaka: false },
  { name: "Lakshmipur", insideDhaka: false },
  { name: "Chandpur", insideDhaka: false },

  // Sylhet Division
  { name: "Sylhet", insideDhaka: false },
  { name: "Moulvibazar", insideDhaka: false },
  { name: "Habiganj", insideDhaka: false },
  { name: "Sunamganj", insideDhaka: false },

  // Rajshahi Division
  { name: "Rajshahi", insideDhaka: false },
  { name: "Bogura", insideDhaka: false },
  { name: "Pabna", insideDhaka: false },
  { name: "Natore", insideDhaka: false },
  { name: "Naogaon", insideDhaka: false },
  { name: "Chapainawabganj", insideDhaka: false },
  { name: "Joypurhat", insideDhaka: false },
  { name: "Sirajganj", insideDhaka: false },

  // Khulna Division
  { name: "Khulna", insideDhaka: false },
  { name: "Jessore", insideDhaka: false },
  { name: "Satkhira", insideDhaka: false },
  { name: "Bagerhat", insideDhaka: false },
  { name: "Narail", insideDhaka: false },
  { name: "Magura", insideDhaka: false },
  { name: "Jhenaidah", insideDhaka: false },
  { name: "Kushtia", insideDhaka: false },
  { name: "Chuadanga", insideDhaka: false },
  { name: "Meherpur", insideDhaka: false },

  // Barishal Division
  { name: "Barishal", insideDhaka: false },
  { name: "Bhola", insideDhaka: false },
  { name: "Patuakhali", insideDhaka: false },
  { name: "Pirojpur", insideDhaka: false },
  { name: "Jhalokathi", insideDhaka: false },
  { name: "Barguna", insideDhaka: false },

  // Rangpur Division
  { name: "Rangpur", insideDhaka: false },
  { name: "Dinajpur", insideDhaka: false },
  { name: "Kurigram", insideDhaka: false },
  { name: "Gaibandha", insideDhaka: false },
  { name: "Nilphamari", insideDhaka: false },
  { name: "Lalmonirhat", insideDhaka: false },
  { name: "Panchagarh", insideDhaka: false },
  { name: "Thakurgaon", insideDhaka: false },

  // Mymensingh Division
  { name: "Mymensingh", insideDhaka: false },
  { name: "Jamalpur", insideDhaka: false },
  { name: "Netrokona", insideDhaka: false },
  { name: "Sherpur", insideDhaka: false },

  // Others
  { name: "Others", insideDhaka: false },
];



// =========================
// DELIVERY FUNCTIONS
// =========================

export const INSIDE_DHAKA_DELIVERY = 80;
export const OUTSIDE_DHAKA_DELIVERY = 120;

export function getDeliveryCharge(cityName) {
  const city = bangladeshCities.find(
    (item) => item.name === cityName
  );

  if (!city) {
    return OUTSIDE_DHAKA_DELIVERY;
  }

  return city.insideDhaka
    ? INSIDE_DHAKA_DELIVERY
    : OUTSIDE_DHAKA_DELIVERY;
}

export function isInsideDhaka(cityName) {
  const city = bangladeshCities.find(
    (item) => item.name === cityName
  );

  return city?.insideDhaka || false;
}