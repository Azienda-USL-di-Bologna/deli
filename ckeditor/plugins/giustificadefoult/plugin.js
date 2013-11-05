CKEDITOR.plugins.add('giustificadefoult',
{
    init: function(editor)
    {
        tagJf = editor.config.tagGiustifica;
		plugingiustificadefoultName = 'giustificadefoult';

		
		editor.on( 'dataReady', function( e )
			{
				var ckDocument = editor.document;
				if (ckDocument){
				var element = ckDocument.getById( 'testo_lettera' );
					if (element)
							{
							//element.setAttribute( 'align', 'justify' );
							/*var element2 = ckDocument.getById( 'giustificato' );
								if (!element2){
								var parteeditata = editor.getData();
								var element = new CKEDITOR.dom.element(tagJf);
								element.setAttribute( 'id', 'giustificato' );
								element.setAttribute( 'class', plugingiustificadefoultName );
								element.setHtml( parteeditata );
								editor.setData(element.getOuterHtml());
								editor.focus();
								}*/
							}
				}
			});
    }
});