<template>
  <div>
    <iframe
      height="100%"
      width="100%"
      src="../../../../public/lib/pdfjs-2.7.570-dist/web/viewer.html?file=PDF.pdf"
    ></iframe>
  </div>
</template>

<script>
export default {
  name: "PdfViewer",
  props: {}
};
</script>
<style scoped>
div {
  width: 50%;
  height: 79vh;
  min-width: 400px;
}
</style>
