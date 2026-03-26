import { jsPDF } from 'jspdf';
import QRCode from 'qrcode';
import { DemoState } from './types';
import { formatETH, shortenAddress } from './utils';

export const generateReceipt = async (state: DemoState) => {
  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  
  // Colors
  const primaryBlue = '#183EC2';
  const darkGray = '#1F2937';
  const lightGray = '#6B7280';
  
  // Header - Veritrax Logo and Title
  pdf.setFillColor(24, 62, 194);
  pdf.rect(0, 0, pageWidth, 40, 'F');
  
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(24);
  pdf.setFont('helvetica', 'bold');
  pdf.text('VERITRAX', pageWidth / 2, 20, { align: 'center' });
  
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  pdf.text('Blockchain Donation Receipt', pageWidth / 2, 30, { align: 'center' });
  
  // Receipt Number and Date
  pdf.setTextColor(31, 41, 55);
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  const receiptNumber = `VTX-${Date.now().toString().slice(-8)}`;
  const currentDate = new Date().toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  
  pdf.text(`Receipt #: ${receiptNumber}`, 20, 55);
  pdf.text(`Date: ${currentDate}`, 20, 62);
  
  // Status Badge
  pdf.setFillColor(34, 197, 94);
  pdf.roundedRect(pageWidth - 60, 50, 40, 10, 2, 2, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'bold');
  pdf.text('VERIFIED', pageWidth - 40, 57, { align: 'center' });
  
  // Divider
  pdf.setDrawColor(229, 231, 235);
  pdf.setLineWidth(0.5);
  pdf.line(20, 75, pageWidth - 20, 75);
  
  // Campaign Details
  pdf.setTextColor(31, 41, 55);
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Campaign Details', 20, 90);
  
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(107, 114, 128);
  
  pdf.text('Campaign Name:', 20, 102);
  pdf.setTextColor(31, 41, 55);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Aid for Flood Victims', 80, 102);
  
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(107, 114, 128);
  pdf.text('Categories:', 20, 112);
  pdf.setTextColor(31, 41, 55);
  pdf.text(state.campaign.categories.join(', '), 80, 112);
  
  // Transaction Details Box
  pdf.setFillColor(239, 246, 255);
  pdf.roundedRect(20, 125, pageWidth - 40, 60, 3, 3, 'F');
  
  pdf.setTextColor(31, 41, 55);
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Transaction Details', 30, 140);
  
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(107, 114, 128);
  
  // Amount
  pdf.text('Donation Amount:', 30, 152);
  pdf.setTextColor(24, 62, 194);
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.text(formatETH(state.amount), 30, 162);
  pdf.setFontSize(10);
  pdf.setTextColor(107, 114, 128);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`≈ $${(state.amount * 2000).toFixed(2)} USD`, 30, 170);
  
  // Wallet Address
  pdf.setTextColor(107, 114, 128);
  pdf.text('From Wallet:', 110, 152);
  pdf.setTextColor(31, 41, 55);
  pdf.setFont('helvetica', 'bold');
  pdf.text(shortenAddress(state.donorAddress), 110, 160);
  
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(107, 114, 128);
  pdf.text('To Recipient:', 110, 170);
  pdf.setTextColor(31, 41, 55);
  pdf.setFont('helvetica', 'bold');
  pdf.text(shortenAddress(state.needyAddress), 110, 178);
  
  // Blockchain Verification
  pdf.setTextColor(31, 41, 55);
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Blockchain Verification', 20, 200);
  
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(107, 114, 128);
  
  pdf.text('Transaction Hash:', 20, 212);
  pdf.setFont('courier', 'normal');
  pdf.setFontSize(8);
  pdf.setTextColor(31, 41, 55);
  pdf.text(state.txId, 20, 220);
  
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(9);
  pdf.setTextColor(107, 114, 128);
  pdf.text('Proof Hash (SHA-256):', 20, 232);
  pdf.setFont('courier', 'normal');
  pdf.setFontSize(7);
  pdf.setTextColor(31, 41, 55);
  const hashLines = pdf.splitTextToSize(state.hash, pageWidth - 40);
  pdf.text(hashLines, 20, 240);
  
  // Generate QR Code
  try {
    // Create blockchain explorer URL
    const explorerUrl = `https://polygonscan.com/tx/${state.txId}`;
    
    // Generate QR code as data URL
    const qrCodeDataUrl = await QRCode.toDataURL(explorerUrl, {
      width: 200,
      margin: 1,
      color: {
        dark: '#183EC2',
        light: '#FFFFFF'
      }
    });
    
    // Add QR code image to PDF
    pdf.addImage(qrCodeDataUrl, 'PNG', pageWidth - 70, 195, 50, 50);
    
    // Add text below QR code
    pdf.setTextColor(107, 114, 128);
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Scan to verify', pageWidth - 45, 252, { align: 'center' });
    pdf.text('on blockchain', pageWidth - 45, 258, { align: 'center' });
  } catch (error) {
    console.error('Error generating QR code:', error);
    // Fallback to text-based placeholder
    pdf.setFillColor(255, 255, 255);
    pdf.roundedRect(pageWidth - 70, 195, 50, 50, 3, 3, 'FD');
    pdf.setTextColor(107, 114, 128);
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Scan to verify', pageWidth - 45, 220, { align: 'center' });
    pdf.text('on blockchain', pageWidth - 45, 228, { align: 'center' });
    
    // Add QR code URL as text
    pdf.setFontSize(6);
    const explorerUrl = `polygonscan.com/tx/${state.txId.slice(0, 10)}...`;
    pdf.text(explorerUrl, pageWidth - 45, 238, { align: 'center' });
  }
  
  // Authorization
  pdf.setFillColor(240, 253, 244);
  pdf.roundedRect(20, 255, pageWidth - 40, 20, 3, 3, 'F');
  
  pdf.setTextColor(22, 163, 74);
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'bold');
  pdf.text('✓ Authorized via x402 Protocol', 30, 267);
  
  // Footer
  pdf.setDrawColor(229, 231, 235);
  pdf.line(20, pageHeight - 30, pageWidth - 20, pageHeight - 30);
  
  pdf.setTextColor(107, 114, 128);
  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'normal');
  pdf.text('This receipt is cryptographically verified on the Polygon blockchain.', pageWidth / 2, pageHeight - 20, { align: 'center' });
  pdf.text('For support, contact: support@veritrax.com', pageWidth / 2, pageHeight - 13, { align: 'center' });
  
  // Save PDF
  pdf.save(`Veritrax-Receipt-${receiptNumber}.pdf`);
};
