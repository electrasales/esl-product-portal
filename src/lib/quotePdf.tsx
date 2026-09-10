"use client";

import type { CartItem } from "@/lib/cart";

const styles = {
  page: { padding: 32, fontSize: 11, fontFamily: "Helvetica" },
  title: { fontSize: 18, marginBottom: 4 },
  subtitle: { fontSize: 10, color: "#666", marginBottom: 20 },
  row: {
    flexDirection: "row" as const,
    borderBottom: "1px solid #e5e5e5",
    paddingVertical: 6,
  },
  headerRow: {
    flexDirection: "row" as const,
    borderBottom: "2px solid #111",
    paddingBottom: 6,
    marginBottom: 4,
    fontWeight: 700 as const,
  },
  colName: { flex: 3 },
  colQty: { flex: 1, textAlign: "right" as const },
  colPrice: { flex: 1, textAlign: "right" as const },
  colTotal: { flex: 1, textAlign: "right" as const },
  totalRow: {
    flexDirection: "row" as const,
    justifyContent: "flex-end" as const,
    marginTop: 16,
  },
  totalLabel: { marginRight: 12, fontWeight: 700 as const },
};

export async function downloadQuotePdf(
  items: CartItem[],
  customerName: string,
) {
  const { Document, Page, Text, View, pdf } = await import(
    "@react-pdf/renderer"
  );
  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const date = new Date().toLocaleDateString();

  const doc = (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Product Quote</Text>
        <Text style={styles.subtitle}>
          Prepared for {customerName || "Customer"} on {date}
        </Text>

        <View style={styles.headerRow}>
          <Text style={styles.colName}>Item</Text>
          <Text style={styles.colQty}>Qty</Text>
          <Text style={styles.colPrice}>Unit Price</Text>
          <Text style={styles.colTotal}>Total</Text>
        </View>

        {items.map((item) => (
          <View key={item.productId} style={styles.row}>
            <Text style={styles.colName}>{item.name}</Text>
            <Text style={styles.colQty}>{item.quantity}</Text>
            <Text style={styles.colPrice}>${item.price.toFixed(2)}</Text>
            <Text style={styles.colTotal}>
              ${(item.price * item.quantity).toFixed(2)}
            </Text>
          </View>
        ))}

        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Grand Total</Text>
          <Text>${total.toFixed(2)}</Text>
        </View>
      </Page>
    </Document>
  );

  const blob = await pdf(doc).toBlob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `quote-${Date.now()}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
