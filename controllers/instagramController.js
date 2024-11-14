// controllers/instagramController.js
export const getInstagramFeed = (req, res) => {
    const lightWidgetEmbedCode = `
      <script src="https://cdn.lightwidget.com/widgets/lightwidget.js"></script>
      <iframe 
        src="//lightwidget.com/widgets/ede592244808509da6bd67c9dc45177b.html" 
        scrolling="no" 
        allowtransparency="true" 
        class="lightwidget-widget" 
        style="width:100%;border:0;overflow:hidden;">
      </iframe>
    `;
    
    // Send the embed code in JSON format
    res.status(200).json({ embedCode: lightWidgetEmbedCode });
  };
  