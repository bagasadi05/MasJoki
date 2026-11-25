import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

import { SITE_URL } from "./config";
import { rupiah } from "./format";
import type { PriceResult } from "./pricing";
import type { Service } from "./services";
import { pembayaran } from "./site";
import type { OrderInput } from "./validation";

/**
 * Kwitansi PDF — dibuat di server (route /kwitansi) dari harga hasil hitung
 * ulang server. Hanya font Latin bawaan (Helvetica) yang dipakai supaya teks
 * Indonesia aman; hindari emoji/ikon di PDF.
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
  detail: {
    fontSize: 8,
    color: "#5F6672",
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

export interface KwitansiPdfProps {
  kode: string;
  tanggal: string;
  service: Service;
  price: PriceResult;
  data: OrderInput;
}

export function KwitansiPdf({ kode, tanggal, service, price, data }: KwitansiPdfProps) {
  return (
    <Document
      title={`Kwitansi Estimasi ${kode} — Mas Joki`}
      author="Mas Joki"
      subject="Estimasi biaya pesanan (bukan bukti pembayaran)"
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

          <Text style={styles.judul}>KWITANSI ESTIMASI BIAYA</Text>
          <Text style={styles.peringatan}>
            Dokumen ini adalah estimasi biaya pesanan, BUKAN bukti pembayaran. Bukti
            pembayaran resmi adalah konfirmasi di chat WhatsApp setelah transfer
            selesai.
          </Text>

          <View style={styles.garis} />

          {/* Info pesanan */}
          <View style={styles.barisInfo}>
            <Text style={styles.labelInfo}>Tanggal</Text>
            <Text style={styles.nilaiInfo}>{tanggal}</Text>
          </View>
          <View style={styles.barisInfo}>
            <Text style={styles.labelInfo}>Layanan</Text>
            <Text style={styles.nilaiInfo}>{service.name}</Text>
          </View>
          <View style={styles.barisInfo}>
            <Text style={styles.labelInfo}>Jumlah</Text>
            <Text style={styles.nilaiInfo}>
              {price.qty} {price.equivalentLabel ? "" : ""}
            </Text>
          </View>
          <View style={styles.barisInfo}>
            <Text style={styles.labelInfo}>Tenggat</Text>
            <Text style={styles.nilaiInfo}>{price.deadline.label}</Text>
          </View>
          <View style={styles.barisInfo}>
            <Text style={styles.labelInfo}>Tingkat kesulitan</Text>
            <Text style={styles.nilaiInfo}>{price.difficulty.label}</Text>
          </View>
          <View style={styles.barisInfo}>
            <Text style={styles.labelInfo}>Estimasi selesai</Text>
            <Text style={styles.nilaiInfo}>{price.estimatedTurnaround}</Text>
          </View>

          <View style={styles.garis} />

          {/* Rincian harga */}
          {price.lines.map((line, index) => {
            const isDiscount = line.amount < 0 || line.kind === "discount";
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
                {line.detail ? <Text style={styles.detail}>{line.detail}</Text> : null}
              </View>
            );
          })}

          <View style={styles.totalBox}>
            <View style={styles.barisTotal}>
              <Text style={styles.totalLabel}>TOTAL AKHIR</Text>
              <Text style={styles.totalNilai}>{rupiah(price.total)}</Text>
            </View>
            <View style={styles.barisTotal}>
              <Text style={styles.labelInfo}>Opsi DP 50%</Text>
              <Text style={styles.amount}>{rupiah(price.dpAmount)}</Text>
            </View>
            <View style={styles.barisTotal}>
              <Text style={styles.labelInfo}>Pelunasan saat selesai</Text>
              <Text style={styles.amount}>{rupiah(price.pelunasanAmount)}</Text>
            </View>
          </View>

          {price.minimumAdjustmentNote ? (
            <Text style={[styles.detail, { marginTop: 6 }]}>{price.minimumAdjustmentNote}</Text>
          ) : null}

          <View style={styles.garis} />

          {/* Pemesan */}
          <View style={styles.bagian}>
            <Text style={styles.judulBagian}>PEMESAN</Text>
            <View style={styles.barisInfo}>
              <Text style={styles.labelInfo}>Nama</Text>
              <Text style={styles.nilaiInfo}>{data.name}</Text>
            </View>
            <View style={styles.barisInfo}>
              <Text style={styles.labelInfo}>WhatsApp</Text>
              <Text style={styles.nilaiInfo}>{data.whatsapp}</Text>
            </View>
          </View>

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
              Harga dihitung otomatis oleh sistem dan dikonfirmasi Mas Joki sebelum
              pembayaran. Revisi 2x gratis · file sumber .docx/.pptx diserahkan.
            </Text>
            <Text style={styles.footerUrl}>{SITE_URL.replace(/^https?:\/\//, "")}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}
