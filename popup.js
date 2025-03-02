document.addEventListener('DOMContentLoaded', () => {
  let generatedImages = [];
  let currentSelectedImageIndex = 0;
  const generateBtn = document.getElementById('generateBtn');
  const downloadSingleBtn = document.getElementById('downloadSingleBtn');
  const downloadAllBtn = document.getElementById('downloadAllBtn');
  const previewContainer = document.getElementById('previewContainer');
  
  // 生成图片
  generateBtn.addEventListener('click', () => {
    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;
    const footer = document.getElementById('footer').value;
    const [width, height] = document.getElementById('imageSize').value.split('x').map(Number);
    
    generatedImages = generateImages(title, content, footer, width, height);
    displayPreviews(generatedImages);
  });
  
  // 生成图片函数
  function generateImages(title, content, footer, width, height) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = width;
    canvas.height = height;
    
    // 设置字体和样式
    const titleFont = '36px Microsoft YaHei';
    const contentFont = '24px Microsoft YaHei';
    const footerFont = '20px Microsoft YaHei';
    const lineHeight = 1.5;
    const padding = 40;
    
    // 分页处理文本
    const pages = [];
    let currentPage = { title, content: '', footer };
    const contentLines = splitTextIntoLines(content, width - padding * 2, contentFont);
    const maxLinesPerPage = Math.floor((height - padding * 4) / (24 * lineHeight));
    
    for (let i = 0; i < contentLines.length; i++) {
      if (currentPage.content.split('\n').length >= maxLinesPerPage) {
        pages.push({ ...currentPage });
        currentPage.content = '';
      }
      currentPage.content += contentLines[i] + '\n';
    }
    pages.push(currentPage);
    
    // 渲染每一页
    return pages.map((page, index) => {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, width, height);
      
      // 绘制标题
      ctx.font = titleFont;
      ctx.fillStyle = '#333333';
      ctx.textAlign = 'center';
      ctx.fillText(page.title, width / 2, padding + 36);
      
      // 绘制正文
      ctx.font = contentFont;
      ctx.textAlign = 'left';
      let y = padding + 100;
      page.content.split('\n').forEach(line => {
        if (line.trim()) {
          ctx.fillText(line, padding, y);
          y += 24 * lineHeight;
        }
      });
      
      // 绘制页尾
      ctx.font = footerFont;
      ctx.textAlign = 'center';
      ctx.fillText(page.footer, width / 2, height - padding);
      
      // 添加页码
      if (pages.length > 1) {
        ctx.fillText(`${index + 1}/${pages.length}`, width - padding, height - padding);
      }
      
      return canvas.toDataURL('image/png');
    });
  }
  
  // 文本分行函数
  function splitTextIntoLines(text, maxWidth, font) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx.font = font;
    
    const lines = [];
    let currentLine = '';
    
    text.split('').forEach(char => {
      const testLine = currentLine + char;
      const metrics = ctx.measureText(testLine);
      
      if (metrics.width > maxWidth && currentLine) {
        lines.push(currentLine);
        currentLine = char;
      } else {
        currentLine = testLine;
      }
    });
    
    if (currentLine) {
      lines.push(currentLine);
    }
    
    return lines;
  }
  
  // 显示预览图片
  function displayPreviews(images) {
    previewContainer.innerHTML = '';
    images.forEach((dataUrl, index) => {
      const img = document.createElement('img');
      img.src = dataUrl;
      img.dataset.index = index;
      img.classList.toggle('selected', index === currentSelectedImageIndex);
      img.addEventListener('click', () => {
        previewContainer.querySelectorAll('img').forEach(img => img.classList.remove('selected'));
        img.classList.add('selected');
        currentSelectedImageIndex = index;
      });
      previewContainer.appendChild(img);
    });
  }
  
  // 下载单张图片
  downloadSingleBtn.addEventListener('click', () => {
    if (generatedImages.length === 0) return;
    const selectedImage = generatedImages[currentSelectedImageIndex];
    if (selectedImage) {
      const link = document.createElement('a');
      link.download = `文图宝_${currentSelectedImageIndex + 1}.png`;
      link.href = selectedImage;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  });
  
  // 批量下载
  downloadAllBtn.addEventListener('click', async () => {
    if (generatedImages.length === 0) {
      alert('请先生成图片');
      return;
    }
    
    downloadAllBtn.disabled = true;
    downloadAllBtn.textContent = '正在打包...';
    
    try {
      const zip = new JSZip();
      for (let i = 0; i < generatedImages.length; i++) {
        const dataUrl = generatedImages[i];
        const base64Data = dataUrl.replace('data:image/png;base64,', '');
        zip.file(`文图宝_${i + 1}.png`, base64Data, { base64: true });
      }
      
      const content = await zip.generateAsync({
        type: 'blob',
        compression: 'DEFLATE',
        compressionOptions: { level: 6 }
      });
      
      const link = document.createElement('a');
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      link.download = `文图宝_${timestamp}.zip`;
      link.href = URL.createObjectURL(content);
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setTimeout(() => {
        URL.revokeObjectURL(link.href);
      }, 1000);
    } catch (error) {
      console.error('批量下载出错：', error);
      alert('下载失败，请重试');
    } finally {
      downloadAllBtn.disabled = false;
      downloadAllBtn.textContent = '批量下载(ZIP)';
    }
  });
});