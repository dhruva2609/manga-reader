// src/MangaChapterPdf.js
import React from 'react';
import { Document, Page, Image, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: 10, backgroundColor: '#fff' },
  title: { fontSize: 18, marginBottom: 10 },
  image: { width: '100%', marginBottom: 8 },
});

const MangaChapterPdf = ({ mangaTitle, chapterTitle, pageImages }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>{mangaTitle} - {chapterTitle}</Text>
      <View>
        {pageImages.map((img, idx) => (
          <Image key={idx} src={img} style={styles.image} />
        ))}
      </View>
    </Page>
  </Document>
);

export default MangaChapterPdf;
