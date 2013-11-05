// non funziona corettamente: inserendo degli elenchi puntati o numerati, viene chiuso il tag div prima degli elenchi, quindi questi non risultano identati

var removeTagAroundDocument = CKEDITOR.tools.addFunction(
	function(editor){
					var ckDocument = editor.document;
					//if (ckDocument){
					//	var element3 = ckDocument.getById( 'testo_lettera' );
					//		if (element3)
					//			{
					//			element3.removeAttributes( 'align' );
					//			}
					//	}					
					var element = ckDocument.getById( 'giustificato' );
					var parteeditata = editor.getData();
					var element = CKEDITOR.dom.element.createFromHtml(parteeditata);
					editor.setData(element.getHtml());
					editor.focus();
					//editor.updateElement();
					//editor.getCommand(pluginName).setState(CKEDITOR.TRISTATE_OFF);
					});

var insertTagAroundDocument = CKEDITOR.tools.addFunction(
	function(editor){
					var parteeditata = editor.getData();
					//if (ckDocument){
					//var element5 = ckDocument.getById( 'testo_lettera' );
					//	if (element5)
					//			{
					//			element5.setAttribute( 'align', 'justify' );
					//			}
					//}					
					var element = new CKEDITOR.dom.element(tagJf);
					element.setAttribute( 'id', 'giustificato' );
					element.setAttribute( 'class', pluginGiustificaName );
					element.setHtml( parteeditata );
					editor.setData(element.getOuterHtml());
					editor.focus();
					//editor.updateElement();
					//editor.getCommand(pluginName).setState(CKEDITOR.TRISTATE_ON);
					});

var giustifica = CKEDITOR.tools.addFunction(
    function(editor)
				{
					if (editor.getCommand(pluginGiustificaName).state == CKEDITOR.TRISTATE_ON)
					{
						CKEDITOR.tools.callFunction(removeTagAroundDocument, editor);
					}
					else
					{
						CKEDITOR.tools.callFunction(insertTagAroundDocument, editor);
					}
				});

CKEDITOR.plugins.add('giustifica',
{
    init: function(editor)
    {
        tagJf = editor.config.tagGiustifica;
		pluginGiustificaName = 'giustifica';
		pluginGiustificaNameState = 'giustificastate';

        editor.addCommand( pluginGiustificaName,
			{
				exec: function(editor)
				{
				CKEDITOR.tools.callFunction( giustifica, editor);
				}
			});
	
		editor.ui.add( 'Giustifica', CKEDITOR.UI_BUTTON,
            {
                label: 'giustifica',
                icon: this.path + pluginGiustificaName + '.gif',
                command: pluginGiustificaName
            });
		
		editor.on( 'dataReady', function( e )
			{
				var ckDocument = editor.document;
				if (ckDocument){
				var element = ckDocument.getById( 'giustificato' );
					if (!element)
							{
							editor.getCommand(pluginGiustificaName).setState(CKEDITOR.TRISTATE_OFF);
							}
						else 
							{
							editor.getCommand(pluginGiustificaName).setState(CKEDITOR.TRISTATE_ON);
							}
				}
			});
    }
});