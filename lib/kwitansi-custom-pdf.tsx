import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

import { SITE_URL } from "./config";
import { rupiah } from "./format";
import type { BarisKwitansi } from "./kwitansi-custom";
import { hitungDp } from "./pricing";
import { pembayaran } from "./site";

/**
 * Kwitansi custom — dicetak dari route /admin/kwitansi/buat KHUSUS pengelola
 * yang sudah login (ADMIN_EMAILS). Berbeda dengan KwitansiPdf: rincian diisi
 * manual oleh pengelola, bukan dihitung dari katalog layanan. Gaya visual sama:
 * hanya font Latin bawaan (Helvetica) supaya teks Indonesia aman.
 */

const styles = StyleSheet.create({
  halaman: {
    backgroundColor: "#F7F2E6",
    padding: 36,
    fontFamily: "Helvetica",
    color: "#101A33",
    fontSize: 10,
  },
  kartu: {
    backgroundColor: "#FFFDF6",
    borderWidth: 1.5,
    borderColor: "#101A33",
    borderRadius: 10,
    padding: 22,
  },
  pita: {
    flexDirection: "row",
    height: 6,
    marginBottom: 18,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  brand: {
    fontFamily: "Helvetica-Bold",
    fontSize: 15,
    letterSpacing: 3,
    color: "#1F3BE0",
  },
  subbrand: {
    fontSize: 8.5,
    color: "#5F6672",
    marginTop: 3,
  },
  kodeBox: {
    borderWidth: 1,
    borderColor: "#DDD3BD",
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: "#ECE4D2",
  },
  kode: {
    fontFamily: "Courier-Bold",
    fontSize: 10,
    color: "#3C465C",
  },
  judul: {
    fontFamily: "Helvetica-Bold",
    fontSize: 17,
    marginTop: 16,
  },
  peringatan: {
    fontSize: 8,
    color: "#9E4E42",
    marginTop: 4,
    backgroundColor: "#F6E7E2",
    borderRadius: 4,
    padding: 6,
  },
  garis: {
    borderTopWidth: 1,
    borderTopColor: "#DDD3BD",
    borderTopStyle: "dashed",
    marginVertical: 12,
  },
  barisInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  labelInfo: {
    color: "#5F6672",
    fontSize: 9,
  },
  nilaiInfo: {
    fontFamily: "Helvetica-Bold",
    fontSize: 9.5,
  },
  baris: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  label: {
    fontSize: 9.5,
  },
  amount: {
    fontFamily: "Courier-Bold",
    fontSize: 9.5,
  },
  diskon: {
    color: "#2A6B55",
  },
  totalBox: {
    backgroundColor: "#ECE4D2",
    borderRadius: 8,
    padding: 10,
    marginTop: 6,
  },
  barisTotal: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 3,
  },
  totalLabel: {
    fontFamily: "Helvetica-Bold",
    fontSize: 10,
  },
  totalNilai: {
    fontFamily: "Courier-Bold",
    fontSize: 15,
    color: "#1F3BE0",
  },
  bagian: {
    marginTop: 12,
  },
  judulBagian: {
    fontFamily: "Helvetica-Bold",
    fontSize: 9,
    letterSpacing: 1.5,
    color: "#3C465C",
    marginBottom: 5,
  },
  teks: {
    fontSize: 9,
    color: "#3C465C",
    lineHeight: 1.45,
  },
  footer: {
    marginTop: 16,
    borderTopWidth: 1.5,
    borderTopColor: "#101A33",
    paddingTop: 8,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  footerTeks: {
    fontSize: 7.5,
    color: "#5F6672",
    maxWidth: 300,
    lineHeight: 1.4,
  },
  footerUrl: {
    fontFamily: "Courier-Bold",
    fontSize: 9,
    color: "#2A6B55",
  },
});

const PITA = [
  "#1F3BE0",
  "#2A6B55",
  "#9E4E42",
  "#6556A3",
  "#8A5D12",
  "#2B6A97",
  "#5F6F2A",
  "#9D4D6B",
];

export interface KwitansiCustomPdfProps {
  kode: string;
  tanggal: string;
  judul: string;
  name: string;
  whatsapp: string;
  lines: BarisKwitansi[];
  total: number;
  catatan?: string;
}

export function KwitansiCustomPdf({
  kode,
  tanggal,
  judul,
  name,
  whatsapp,
  lines,
  total,
  catatan,
}: KwitansiCustomPdfProps) {
  const dpAmount = hitungDp(Math.max(0, total));
  const pelunasanAmount = Math.max(0, total) - dpAmount;

  return (
    <Document
      title={`Kwitansi ${kode} — Mas Joki`}
      author="Mas Joki"
      subject="Kwitansi pesanan (bukan bukti pembayaran)"
    >
      <Page size="A4" style={styles.halaman}>
        <View style={styles.kartu}>
          {/* Pita warna layanan */}
          <View style={styles.pita}>
            {PITA.map((warna) => (
              <View key={warna} style={{ flex: 1, backgroundColor: warna }} />
            ))}
          </View>

          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.brand}>MAS JOKI</Text>
              <Text style={styles.subbrand}>Bantuan tugas kuliah · harga transparan</Text>
            </View>
            <View style={styles.kodeBox}>
              <Text style={styles.kode}>{kode}</Text>
            </View>
          </View>

          <Text style={styles.judul}>KWITANSI</Text>
          <Text style={styles.peringatan}>
            Dokumen ini BUKAN bukti pembayaran. Bukti pembayaran resmi adalah
            konfirmasi di chat WhatsApp setelah transfer selesai.
          </Text>

          <View style={styles.garis} />

          {/* Info pesanan */}
          <View style={styles.barisInfo}>
            <Text style={styles.labelInfo}>Tanggal</Text>
            <Text style={styles.nilaiInfo}>{tanggal}</Text>
          </View>
          <View style={styles.barisInfo}>
            <Text style={styles.labelInfo}>Perihal</Text>
            <Text style={styles.nilaiInfo}>{judul}</Text>
          </View>

          <View style={styles.garis} />

          {/* Rincian custom */}
          {lines.map((line, index) => {
            const isDiscount = line.amount < 0;
            return (
              <View key={`${line.label}-${index}`}>
                <View style={styles.baris}>
                  <Text style={[styles.label, isDiscount ? styles.diskon : undefined]}>
                    {line.label}
                  </Text>
                  <Text style={[styles.amount, isDiscount ? styles.diskon : undefined]}>
                    {isDiscount ? `- ${rupiah(Math.abs(line.amount))}` : rupiah(line.amount)}
                  </Text>
                </View>
              </View>
            );
          })}

          <View style={styles.totalBox}>
            <View style={styles.barisTotal}>
              <Text style={styles.totalLabel}>TOTAL AKHIR</Text>
              <Text style={styles.totalNilai}>{rupiah(total)}</Text>
            </View>
            {total > 0 ? (
              <>
                <View style={styles.barisTotal}>
                  <Text style={styles.labelInfo}>Opsi DP 50%</Text>
                  <Text style={styles.amount}>{rupiah(dpAmount)}</Text>
                </View>
                <View style={styles.barisTotal}>
                  <Text style={styles.labelInfo}>Pelunasan saat selesai</Text>
                  <Text style={styles.amount}>{rupiah(pelunasanAmount)}</Text>
                </View>
              </>
            ) : null}
          </View>

          <View style={styles.garis} />

          {/* Pemesan */}
          <View style={styles.bagian}>
            <Text style={styles.judulBagian}>PEMESAN</Text>
            <View style={styles.barisInfo}>
              <Text style={styles.labelInfo}>Nama</Text>
              <Text style={styles.nilaiInfo}>{name}</Text>
            </View>
            <View style={styles.barisInfo}>
              <Text style={styles.labelInfo}>WhatsApp</Text>
              <Text style={styles.nilaiInfo}>{whatsapp}</Text>
            </View>
          </View>

          {/* Catatan */}
          {catatan ? (
            <View style={styles.bagian}>
              <Text style={styles.judulBagian}>CATATAN</Text>
              <Text style={styles.teks}>{catatan}</Text>
            </View>
          ) : null}

          {/* Pembayaran */}
          <View style={styles.bagian}>
            <Text style={styles.judulBagian}>PEMBAYARAN (SETELAH KONFIRMASI)</Text>
            <Text style={styles.teks}>
              {pembayaran.metode.join(" · ")} ke nomor {pembayaran.nomor} a.n. Mas Joki.
              Kirim bukti transfer di chat WhatsApp yang sama dengan pesanan.
            </Text>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerTeks}>
              Rincian pada kwitansi ini diisi oleh pengelola Mas Joki dan dikonfirmasi
              lewat chat WhatsApp sebelum pembayaran. Revisi 2x gratis · file sumber
              .docx/.pptx diserahkan.
            </Text>
            <Text style={styles.footerUrl}>{SITE_URL.replace(/^https?:\/\//, "")}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}
