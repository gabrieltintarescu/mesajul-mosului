import { InvoicingDetails, OrderRow } from '@/lib/supabase/database.types';
import { jsPDF } from 'jspdf';

/**
 * Generate an invoice PDF as a Buffer
 * Uses jsPDF for server-side PDF generation (no browser required)
 */
export async function generateInvoicePdf(order: OrderRow): Promise<Buffer> {
    const invoicing = order.invoicing_details as InvoicingDetails | null;
    const invoiceNumber = `INV-${order.id.slice(0, 8).toUpperCase()}`;
    const invoiceDate = new Date().toLocaleDateString('ro-RO', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    // Use actual pricing from order data
    // final_price is what the customer paid
    // discount_amount is the coupon discount applied
    const finalPrice = order.final_price || 0;
    const couponDiscount = order.discount_amount || 0;

    // The base price is final_price + coupon_discount (reverse calculate from actual data)
    // This ensures the invoice matches exactly what was charged
    const basePrice = finalPrice + couponDiscount;

    const formatPrice = (bani: number) => `${(bani / 100).toFixed(2)} RON`;

    // Create PDF document
    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    let y = margin;

    // Colors
    const primaryColor: [number, number, number] = [196, 30, 58]; // Christmas red
    const greenColor: [number, number, number] = [26, 71, 42]; // Christmas green
    const grayColor: [number, number, number] = [102, 102, 102];
    const lightGray: [number, number, number] = [153, 153, 153];

    // ===== HEADER =====
    // Logo/Company name
    doc.setFontSize(20);
    doc.setTextColor(...primaryColor);
    doc.setFont('helvetica', 'bold');
    doc.text('Mesajul Mosului', margin, y);

    y += 6;
    doc.setFontSize(10);
    doc.setTextColor(...grayColor);
    doc.setFont('helvetica', 'normal');
    doc.text('Videoclipuri personalizate de la Mos Craciun', margin, y);

    // Invoice title (right side)
    doc.setFontSize(24);
    doc.setTextColor(...primaryColor);
    doc.setFont('helvetica', 'bold');
    doc.text('FACTURA', pageWidth - margin, margin, { align: 'right' });

    doc.setFontSize(11);
    doc.setTextColor(...grayColor);
    doc.setFont('helvetica', 'normal');
    doc.text(invoiceNumber, pageWidth - margin, margin + 8, { align: 'right' });
    doc.text(`Data: ${invoiceDate}`, pageWidth - margin, margin + 14, { align: 'right' });

    // Header line
    y += 10;
    doc.setDrawColor(...primaryColor);
    doc.setLineWidth(0.5);
    doc.line(margin, y, pageWidth - margin, y);

    // ===== PARTIES SECTION =====
    y += 15;

    // Supplier info (left)
    doc.setFontSize(9);
    doc.setTextColor(...lightGray);
    doc.setFont('helvetica', 'normal');
    doc.text('FURNIZOR', margin, y);

    y += 6;
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'bold');
    doc.text('GTC SELECT GRUP SRL', margin, y);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    y += 5;
    doc.text('CUI: 39138255', margin, y);
    y += 5;
    doc.text('Reg. Com.: J40/4601/2018', margin, y);
    y += 5;
    doc.text('Str. Comarnic 59', margin, y);
    y += 5;
    doc.text('Bucuresti, Romania', margin, y);
    y += 5;
    doc.text('contact@mesajul-mosului.ro', margin, y);

    // Customer info (right)
    const customerX = pageWidth / 2 + 10;
    let customerY = y - 31; // Go back up

    doc.setFontSize(9);
    doc.setTextColor(...lightGray);
    doc.text('CLIENT', customerX, customerY);

    customerY += 6;
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'bold');

    if (invoicing) {
        if (invoicing.invoiceType === 'business') {
            doc.text(invoicing.companyName || '', customerX, customerY);
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(10);
            customerY += 5;
            doc.text(`Persoana de contact: ${invoicing.name}`, customerX, customerY);
            customerY += 5;
            doc.text(`CUI: ${invoicing.cui || 'N/A'}`, customerX, customerY);
        } else {
            doc.text(invoicing.name, customerX, customerY);
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(10);
        }
        customerY += 5;
        doc.text(invoicing.address, customerX, customerY);
        customerY += 5;
        doc.text(`${invoicing.city}, ${invoicing.county} ${invoicing.postalCode}`, customerX, customerY);
        customerY += 5;
        doc.text(`Tel: ${invoicing.phone}`, customerX, customerY);
    } else {
        doc.text(order.email, customerX, customerY);
    }
    customerY += 5;
    doc.setFont('helvetica', 'normal');
    doc.text(`Email: ${order.email}`, customerX, customerY);

    // ===== TABLE SECTION =====
    y += 20;

    // Table header
    const colWidths = [85, 25, 30, 30]; // Descriere, Cantitate, Pret unitar, Total
    const tableWidth = colWidths.reduce((a, b) => a + b, 0);

    doc.setFillColor(...primaryColor);
    doc.rect(margin, y, tableWidth, 10, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');

    let colX = margin + 3;
    doc.text('DESCRIERE', colX, y + 7);
    colX += colWidths[0];
    doc.text('CANT.', colX, y + 7);
    colX += colWidths[1];
    doc.text('PRET UNITAR', colX, y + 7);
    colX += colWidths[2];
    doc.text('TOTAL', colX, y + 7);

    y += 10;

    // Table rows
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);

    // Row 1: Product
    y += 8;
    colX = margin + 3;
    doc.setFont('helvetica', 'bold');
    doc.text('Videoclip personalizat de la Mos Craciun', colX, y);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(...grayColor);
    doc.text(`Pentru: ${order.child_details.name}`, colX, y + 5);
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);

    colX += colWidths[0];
    doc.text('1', colX + 5, y);
    colX += colWidths[1];
    doc.text(formatPrice(basePrice), colX, y);
    colX += colWidths[2];
    doc.text(formatPrice(basePrice), colX, y);

    // Row separator
    y += 12;
    doc.setDrawColor(238, 238, 238);
    doc.line(margin, y, margin + tableWidth, y);

    // Row 2: Coupon discount (if any)
    if (couponDiscount > 0) {
        y += 8;
        colX = margin + 3;
        doc.setTextColor(...greenColor);
        doc.text(`Cod promotional: ${order.coupon_code}`, colX, y);
        doc.setTextColor(0, 0, 0);
        colX += colWidths[0];
        doc.text('1', colX + 5, y);
        colX += colWidths[1];
        doc.text(`-${formatPrice(couponDiscount)}`, colX, y);
        colX += colWidths[2];
        doc.text(`-${formatPrice(couponDiscount)}`, colX, y);

        y += 6;
        doc.setDrawColor(238, 238, 238);
        doc.line(margin, y, margin + tableWidth, y);
    }

    // ===== TOTALS SECTION =====
    y += 15;
    const totalsX = pageWidth - margin - 80;

    // Subtotal
    doc.setFontSize(10);
    doc.text('Subtotal:', totalsX, y);
    doc.text(formatPrice(basePrice), pageWidth - margin, y, { align: 'right' });

    // Show discounts only if there are any
    if (couponDiscount > 0) {
        y += 6;
        doc.text('Reduceri:', totalsX, y);
        doc.text(`-${formatPrice(couponDiscount)}`, pageWidth - margin, y, { align: 'right' });
    }

    // Total line
    y += 3;
    doc.setDrawColor(...primaryColor);
    doc.setLineWidth(0.5);
    doc.line(totalsX, y, pageWidth - margin, y);

    y += 8;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(...primaryColor);
    doc.text('TOTAL:', totalsX, y);
    doc.text(formatPrice(finalPrice), pageWidth - margin, y, { align: 'right' });

    // ===== THANK YOU BOX =====
    y += 20;
    doc.setFillColor(248, 248, 248);
    doc.roundedRect(margin, y, pageWidth - 2 * margin, 25, 3, 3, 'F');

    doc.setTextColor(...greenColor);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('Multumim pentru comanda!', pageWidth / 2, y + 10, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(...grayColor);
    doc.text('Videoclipul tau personalizat este in curs de realizare.', pageWidth / 2, y + 18, { align: 'center' });

    // ===== FOOTER =====
    y += 40;
    doc.setDrawColor(238, 238, 238);
    doc.line(margin, y, pageWidth - margin, y);

    y += 8;
    doc.setFontSize(8);
    doc.setTextColor(...lightGray);
    doc.text('Aceasta factura a fost generata electronic si este valabila fara semnatura.', pageWidth / 2, y, { align: 'center' });
    y += 4;
    doc.text(`ID Comanda: ${order.id}`, pageWidth / 2, y, { align: 'center' });
    y += 4;
    doc.text(`© ${new Date().getFullYear()} GTC SELECT GRUP - Toate drepturile rezervate`, pageWidth / 2, y, { align: 'center' });

    // Convert to Buffer
    const pdfArrayBuffer = doc.output('arraybuffer');
    return Buffer.from(pdfArrayBuffer);
}
