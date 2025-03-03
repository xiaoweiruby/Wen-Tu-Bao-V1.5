document.addEventListener('DOMContentLoaded', function() {
  let generatedImages = [];
  let currentSelectedImageIndex = 0;
  const generateBtn = document.getElementById('generateBtn');
  const downloadSingleBtn = document.getElementById('downloadSingleBtn');
  const previewContainer = document.getElementById('previewContainer');
  const titleInput = document.getElementById('title');
  const contentInput = document.getElementById('content');
  const footerInput = document.getElementById('footer');
  const imageSizeSelect = document.getElementById('imageSize');
  const fontSizeSelect = document.getElementById('fontSize');
  const realTimePreview = document.getElementById('realTimePreview');

  // 从localStorage加载保存的数据
  function loadSavedData() {
    titleInput.value = localStorage.getItem('title') || '';
    contentInput.value = localStorage.getItem('content') || '';
    footerInput.value = localStorage.getItem('footer') || '';
    imageSizeSelect.value = localStorage.getItem('imageSize') || '1080x1920';
    fontSizeSelect.value = localStorage.getItem('fontSize') || '24';
    realTimePreview.checked = localStorage.getItem('realTimePreview') === 'true';
    showPageNumber.checked = localStorage.getItem('showPageNumber') === 'true';
    
    // 初始化预览区域
    if (realTimePreview.checked && (titleInput.value || contentInput.value || footerInput.value)) {
      generateAndPreview();
    } else {
      const previewContainer = document.getElementById('previewContainer');
      previewContainer.innerHTML = '<p style="color: #666;">请输入文字内容后勾选实时预览查看输出图片</p>';
    }
}

  // 保存数据到localStorage
  function saveData() {
    localStorage.setItem('title', titleInput.value);
    localStorage.setItem('content', contentInput.value);
    localStorage.setItem('footer', footerInput.value);
    localStorage.setItem('imageSize', imageSizeSelect.value);
    localStorage.setItem('fontSize', fontSizeSelect.value);
    localStorage.setItem('realTimePreview', realTimePreview.checked);
    localStorage.setItem('showPageNumber', showPageNumber.checked);
    if (realTimePreview.checked) {
      generateAndPreview();
    }
    if (realTimePreview.checked) {
      generateAndPreview();
    } else {
      const previewContainer = document.getElementById('previewContainer');
      previewContainer.innerHTML = '<p style="color: #666;">请输入文字内容后勾选实时预览查看输出图片</p>';
    }
  }

  // 加载保存的数据
  loadSavedData();

  // 生成并预览图片
  function generateAndPreview() {
    const title = titleInput.value;
    const content = contentInput.value;
    const footer = footerInput.value;
    const [width, height] = imageSizeSelect.value.split('x').map(Number);
    
    const previewContainer = document.getElementById('previewContainer');
    if (!title && !content && !footer) {
        previewContainer.innerHTML = '<p style="color: #666;">请输入文字内容后点击生成按钮预览</p>';
        return;
    }

    // 显示加载状态
    previewContainer.innerHTML = '<div class="loading">正在生成图片...</div>';
    
    // 使用requestAnimationFrame来优化性能
    requestAnimationFrame(() => {
        generatedImages = generateImages(title, content, footer, width, height);
        displayPreviews(generatedImages);
    });
  }

  // 防抖函数
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // 使用防抖处理保存和预览
  const debouncedSaveAndPreview = debounce(() => {
    saveData();
  }, 500);

  // 为所有输入元素添加实时预览功能
  [titleInput, contentInput, footerInput, imageSizeSelect, fontSizeSelect, document.getElementById('templateStyle')].forEach(element => {
    element.addEventListener('input', debouncedSaveAndPreview);
  });

  realTimePreview.addEventListener('change', saveData);

  // 生成图片函数
  function generateImages(title, content, footer, width, height) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = width;
    canvas.height = height;
    
    // 获取选择的模板样式
    const templateStyle = document.getElementById('templateStyle').value;
    
    // 设置字体和样式
    const fontSize = parseInt(fontSizeSelect.value);
    let titleFont = `${fontSize * 1.5}px Microsoft YaHei`;
    let contentFont = `${fontSize}px Microsoft YaHei`;
    let footerFont = `${fontSize * 0.8}px Microsoft YaHei`;
    let lineHeight = 1.5;
    // 根据图片尺寸动态调整内边距
    let padding = Math.min(40, Math.floor(Math.min(width, height) * 0.05));
    
    // 根据模板设置不同的样式
    let bgColor = '#ffffff';
    let textColor = '#333333';
    let fontFamily = 'Microsoft YaHei';
    
    switch(templateStyle) {
      case 'default':
        // 默认样式保持不变
        break;
      case 'spring-festival':
        bgColor = '#ffebee';
        textColor = '#c62828';
        fontFamily = 'STKaiti';
        padding = 55;
        lineHeight = 1.8;
        break;
      case 'lantern-festival':
        bgColor = '#fff3e0';
        textColor = '#e65100';
        fontFamily = 'STXinwei';
        padding = 50;
        lineHeight = 1.7;
        break;
      case 'mid-autumn':
        bgColor = '#e8eaf6';
        textColor = '#283593';
        fontFamily = 'STFangsong';
        padding = 52;
        lineHeight = 1.8;
        break;
      case 'christmas':
        bgColor = '#e8f5e9';
        textColor = '#1b5e20';
        fontFamily = 'Georgia';
        padding = 45;
        lineHeight = 1.6;
        break;
      case 'academic':
        bgColor = '#f5f5f5';
        textColor = '#212121';
        fontFamily = 'Times New Roman';
        padding = 60;
        lineHeight = 2.0;
        break;
      case 'news':
        bgColor = '#ffffff';
        textColor = '#000000';
        fontFamily = 'Arial';
        padding = 40;
        lineHeight = 1.6;
        break;
      case 'poetry':
        bgColor = '#fff8e1';
        textColor = '#3e2723';
        fontFamily = 'STKaiti';
        padding = 65;
        lineHeight = 2.2;
        break;
      case 'handwriting':
        bgColor = '#fafafa';
        textColor = '#1a237e';
        fontFamily = 'STXingkai';
        padding = 58;
        lineHeight = 2.0;
        break;
      case 'letter':
        bgColor = '#f3e5f5';
        textColor = '#4a148c';
        fontFamily = 'STFangsong';
        padding = 62;
        lineHeight = 1.9;
        break;
    }
    
    // 设置字体
    titleFont = `bold ${fontSize * 1.5}px ${fontFamily}, Microsoft YaHei, sans-serif`;
    contentFont = `${fontSize}px ${fontFamily}, Microsoft YaHei, sans-serif`;
    footerFont = `${fontSize * 0.8}px ${fontFamily}, Microsoft YaHei, sans-serif`;
    
    // 添加字体加载检测
    const isFontAvailable = (fontFamily) => {
      const testString = 'mmmmmmmmmmlli';
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      ctx.font = `12px serif`;
      const baselineWidth = ctx.measureText(testString).width;
      
      ctx.font = `12px ${fontFamily}, serif`;
      const testWidth = ctx.measureText(testString).width;
      
      return baselineWidth !== testWidth;
    };
    
    // 在设置字体之前检查字体是否可用
    if (!isFontAvailable(fontFamily)) {
      console.warn(`字体 ${fontFamily} 不可用，将使用备用字体`);
      fontFamily = 'Microsoft YaHei';
    }
    
    // 分页处理文本
    const pages = [];
    let currentPage = { title: '', content: '', footer: '' };
    
    // 处理标题换行
    const titleLines = splitTextIntoLines(title, width - padding * 2, titleFont);
    currentPage.title = titleLines.join('\n');
    
    // 处理页尾换行
    const footerLines = splitTextIntoLines(footer, width - padding * 2, footerFont);
    
    // 处理正文
    const contentLines = splitTextIntoLines(content, width - padding * 2, contentFont);
    // 计算标题和页尾占用的高度
    const titleHeight = titleLines.length * fontSize * 1.5 * lineHeight;
    const footerHeight = footerLines.length * fontSize * 0.8 * lineHeight;
    // 计算正文可用高度并确定每页最大行数
    const availableHeight = height - titleHeight - footerHeight - padding * 4;
    const maxLinesPerPage = Math.floor(availableHeight / (fontSize * lineHeight));
    currentPage.footer = footerLines.join('\n');
    
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
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, width, height);
      
      // 绘制标题
      ctx.font = titleFont;
      ctx.fillStyle = textColor;
      ctx.textAlign = 'left';
      let titleY = padding + fontSize * 1.5;
      page.title.split('\n').forEach(line => {
        ctx.fillText(line, padding, titleY);
        titleY += fontSize * 1.5 * lineHeight;
      });
      
      // 绘制正文
      ctx.font = contentFont;
      ctx.textAlign = 'left';
      let y = titleY + padding;
      page.content.split('\n').forEach(line => {
        if (line.trim()) {
          ctx.fillText(line, padding, y);
          y += fontSize * lineHeight;
        }
      });
      
      // 绘制页尾
      ctx.font = footerFont;
      ctx.textAlign = 'center';
      let footerY = height - padding - (footerLines.length - 1) * fontSize * 0.8 * lineHeight;
      page.footer.split('\n').forEach(line => {
        ctx.fillText(line, width / 2, footerY);
        footerY += fontSize * 0.8 * lineHeight;
      });
      
      // 添加页码
      if (pages.length > 1 && document.getElementById('showPageNumber').checked) {
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
    const previewWrapper = document.createElement('div');
    previewWrapper.className = 'preview-wrapper';
    
    images.forEach((dataUrl, index) => {
      const imgContainer = document.createElement('div');
      imgContainer.className = 'img-container';
      
      const img = document.createElement('img');
      img.src = dataUrl;
      img.dataset.index = index;
      img.classList.toggle('selected', index === currentSelectedImageIndex);
      
      // 添加加载状态指示
      img.onload = () => imgContainer.classList.add('loaded');
      img.onerror = () => imgContainer.classList.add('error');
      
      img.addEventListener('click', () => {
        previewContainer.querySelectorAll('img').forEach(img => img.classList.remove('selected'));
        img.classList.add('selected');
        currentSelectedImageIndex = index;
        
        // 平滑滚动到选中的图片
        img.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      });
      
      imgContainer.appendChild(img);
      previewWrapper.appendChild(imgContainer);
    });
    
    previewContainer.appendChild(previewWrapper);
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

  // 修改生成按钮事件处理
  generateBtn.addEventListener('click', generateAndPreview);
  showPageNumber.addEventListener('change', () => {
    saveData();
    if (realTimePreview.checked) {
      generateAndPreview();
    }
  });
});