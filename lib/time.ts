/**
 * Utilitas Waktu Indonesia Barat (WIB / UTC+7)
 * Jam operasional resmi Mas Joki: 07.00 – 23.00 WIB setiap hari.
 */

export function getWibDate(date: Date = new Date()): Date {
  // Hitung offset UTC + 7 jam
  const utc = date.getTime() + date.getTimezoneOffset() * 60000;
  return new Date(utc + 7 * 3600000);
}

export function isWibOperational(date: Date = new Date()): boolean {
  const wib = getWibDate(date);
  const hour = wib.getHours();
  return hour >= 7 && hour < 23;
}

const NAMA_HARI = [
  "Minggu",
  "Senin",
  "Selasa",
  "Rabu",
  "Kamis",
  "Jumat",
  "Sabtu",
];

const NAMA_BULAN = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "Mei",
  "Jun",
  "Jul",
  "Ags",
  "Sep",
  "Okt",
  "Nov",
  "Des",
];

function formatTgl(d: Date): string {
  const hari = NAMA_HARI[d.getDay()];
  const tgl = d.getDate();
  const bln = NAMA_BULAN[d.getMonth()];
  return `${hari}, ${tgl} ${bln}`;
}

/**
 * Menghitung rentang tanggal kalender penyelesaian berdasarkan tenggat waktu (WIB)
 */
export function getEstimatedDateRange(deadlineId: string): string {
  const now = getWibDate();

  if (deadlineId === "kilat") {
    const hour = now.getHours();
    if (hour < 15) {
      return "Hari ini sebelum 23.00 WIB";
    }
    return "Besok pagi (maks. 12 jam)";
  }

  let minDays = 3;
  let maxDays = 5;

  if (deadlineId === "santai") {
    minDays = 5;
    maxDays = 7;
  } else if (deadlineId === "normal") {
    minDays = 3;
    maxDays = 5;
  } else if (deadlineId === "cepat") {
    minDays = 1;
    maxDays = 2;
  }

  const startDate = new Date(now);
  startDate.setDate(startDate.getDate() + minDays);

  const endDate = new Date(now);
  endDate.setDate(endDate.getDate() + maxDays);

  if (minDays === maxDays || minDays === 1 && maxDays === 1) {
    return formatTgl(startDate);
  }

  return `${formatTgl(startDate)} – ${formatTgl(endDate)}`;
}
