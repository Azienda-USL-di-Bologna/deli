//*************************************************************
// Assistenza 000697-2013
// Multiupload non renderizzato in caso di assenza di Flash
//*************************************************************
PField.prototype.SetMultiUpload = function(value)
{
  if (value!=undefined)
//  this.MultiUpload = value && (RD3_Glb.IsFlashPresent() || RD3_Glb.IsTouch());
    this.MultiUpload = value && (this.UseFlashForUpload() || this.UseHTML5ForUpload() || RD3_Glb.IsTouch());
}


function RD3_CustomInit()
{
// Velocizza la comparsa della maschera di attesa
RD3_ClientParams.DelayDlgTime = 1500;

//Rallenta l'attivazione delle smartlookup
RD3_ClientParams.SuperActiveDelay = 2000;
}

// ******************************************************************************** 
// Customizzazione header 
// ******************************************************************************** 
WebEntryPoint.prototype.CustomizeHeader = function(parent) 
{ 
this.CommandBox.style.visibility = "hidden"; 
} 



PCell.prototype.CustomizeCK = function()
{
	// L'oggetto Conf è l'oggetto contenente la configurazione di CKEditor
	var config = new Object();

			config.extraPlugins = 'switchbar,omissis,giustificadefoult,custompaste'; //per il correttore ortografico guarda sotto, (15/03/2013-tolto l'omissis)
			//config.extraPlugins = 'switchbar,omissis,giustifica';
			config.switchBarSimple = 'Basic';
			config.switchBarReach = 'Full';
			config.switchBarDefault = 'Basic';
			config.tagOmissis = 'span';
			config.tagGiustifica = 'div';
			config.switchBarSimpleIcon = 'maximise.gif';
			config.switchBarReachIcon = 'minimise.gif';
			//config.forcePasteAsPlainText = true;
			config.resize_enabled = false;
			//config.pasteFromWordCleanupFile = 'cleanword';
			config.allowTagsForJasperReport = new Array("b", "u", "i", "sup", "sub", "li", "br", "ul", "ol");
			
			//setto il correttore ortografico subito attivo, e sulla lingua italiana. TOLTO CORRETTORE
			//config.scayt_autoStartup = false;
			//config.scayt_sLang = 'it_IT';
			
	
		//Configurazioni Toolbar ..... tra parentesi quadre i pulsanti da ragruppare in una sezione, con '/' si va a capo e con '-' si lascia uno spazio
			

			// Configurazione personalizzata dei pulsanti presenti nella toolbar
			config.toolbar_Basic =
			[
				['Cut','Copy','Paste','PasteText'],//,'Scayt'], TOLTO CORRETTORE
				['Undo','Redo','-','Find','Replace','-','SelectAll','RemoveFormat'],
				['SpecialChar'],
				['Table'],
				//['Bold','Italic','Strike','Underline'],
				['Bold','Italic','Strike','Omissis'],// (20/06/2013-tolto l'underline)
				//['Bold','Italic','Strike','Underline','Giustifica','Omissis'],
				['JustifyLeft','JustifyCenter','JustifyRight','JustifyBlock'],
				['NumberedList','BulletedList']
			];
			
			// Configurazione massima dei pulsanti presenti nella toolbar
			config.toolbar_Full =
			[
				['Source','-','NewPage','Preview'],
				['Cut','Copy','Paste','PasteText','PasteFromWord','-','Scayt'],
				['Undo','Redo','-','Find','Replace','-','SelectAll','RemoveFormat'],
				['Image','Table','HorizontalRule','SpecialChar','PageBreak'],
				['Bold','Italic','Strike','Underline','Omissis'], // (15/03/2013-tolto l'omissis)
				//['Bold','Italic','Strike','Underline','Giustifica','Omissis'],
				['JustifyLeft','JustifyCenter','JustifyRight','JustifyBlock'],
				['NumberedList','BulletedList','-','Outdent','Indent','Blockquote'],
				['Link','Unlink','Anchor'],
				['Maximize','-','About'],
				['TextColor','BGColor'],
				['Styles','Format','Font','FontSize'],
				['SwitchBar']
			];
			
			
			
			config.coreStyles_bold = { element : 'b', overrides : 'strong' };
			config.coreStyles_italic = { element : 'i', overrides : 'em' };
			config.tabSpaces = 4;
			//config.basicEntities = false;
			//config.docType = '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN">';			
			config.enterMode = CKEDITOR.ENTER_BR;
			//config.autoParagraph = false;
			//config.fullPage = true;
			config.bodyId = 'testo_lettera';
			

			
			
		//Scelta cinfigurazione toolbar
			//config.toolbar = 'Full';
			config.toolbar = 'Basic';
		
		//è possibile associare un CSS alla parte editabile
			config.contentsCss = 'ckeditor/css/mysitestyles.css'; 
		
		//è possibile definire i colori che si possono utilizzare nella parte editabile 	
			config.colorButton_colors = '00923E,F8C100,28166F';
			config.colorButton_enableMore = false;
		
		//è possibile definire i font che è possibile utilizzare	
			//config.font_names = 'Arial;Times New Roman;Verdana';
		//è possibile assegnare il font di defoult, però sembra non funzionare, quindi lo faccio con il CSS
			//config.font_style =
				//{
				//	element		: 'body',
				//	styles		: { 'font-family' : 'Arial' },
				//};
			
		//è possibile definire le dimensioni dei font da utilizzare
			//config.fontSize_sizes = '10/10px;12/12px;16/16px;24/24px;48/48px;';
		//è possibile definire la dimensione di defoult del font, però sembra non funzionare, quindi lo faccio con il CSS
			//config.fontSize_style =
				//{
				//	element		: 'body',
				//	styles		: { 'font-size' : '10' },
				//};
		
		//è possibile collassare o meno la toolbar	
			config.toolbarCanCollapse = true;
		
		//è possibile rimuovere le informazioni sul percorso degli elementi HTML
			config.removePlugins = 'elementspath';
		
		//è possibile definire il colore di base dell'interfaccia utente
			config.uiColor = '#FED966';

		//è possibile lanciare l'editor con la toolbar collassata	
			config.toolbarStartupExpanded = true;
		
		//lista di templates da proporre a chi edita
			//config.templates_files =
			//	[
			//		'/editor_templates/site_default.js',
			//		'http://www.example.com/user_templates.js
			//	];

		// non ho capito a cosa servono
			//config.dialog_backgroundCoverOpacity = 0.0;
			//config.dialog_buttonsOrder = 'ltr';

/*Modifica Suggerita da Pierangeli, problema riguardanti il dimensionamento in altezza del campo del ckeditor in firefox*/			
if (RD3_Glb.IsFirefox() || RD3_Glb.IsChrome())
{
  // Dimensiono prendendo l'altezza del campo - altezza toolbar (su 3 righe, su 2 righe e' circa 115)
  var h = this.ParentField.GetValueHeight(this.InList) - 50; 
  h = (RD3_Glb.IsSafari()||RD3_Glb.IsChrome()) ? h-5 : h;
  h = h<50 ? 50 : h;
  config.height = h+"px";
  //
  // Disabilito il resize del CKEDITOR interno
  config.resize_enabled = false;
 } 
			
	return config;
}

// ******************************************
// Surroga l'evento di change che non viene lanciato
// quando clicco su un immagine: vedi anche DDManager.OnMouseDown
// ******************************************
/*
KBManager.prototype.SurrogateChangeEvent= function()
{
  if (this.ActiveElement)
  {
    var obj = this.GetObject(this.ActiveElement, true);
    //
    // Il Blur forza la perdita del fuoco: quindi lancia l'onchange se deve.. per sicureppa poi lo gestiamo
    // anche noi da software..
    if (this.ActiveElement)
    {
    	try
    	{
    		this.ActiveElement.blur();
    	}
    	catch(ex) {}
    }
    //
    if (obj && obj.OnChange)
    {
      return RD3_DesktopManager.CallEventHandler(obj.Identifier, "OnChange", this.ActiveElement);
    }
  }
}

*/

TabbedView.prototype.SetHiddenTabs= function(value) 
{
	if (value!=undefined)
		this.HiddenTabs = value;
	//
	if (this.Realized)
	{
	  if (this.HiddenTabs)
	  {
		  this.ToolbarBox.style.display = "none";
		  //
		  // Se nascondo le linguette tolgo il margine sopra, in modo che non ci siano scalini con frame a destra o sinistra..
		  this.ContentBox.style.marginTop = "0px";
		}
		else
		{
		  this.ToolbarBox.style.display = "";
		  this.ContentBox.style.marginTop = "0px"; // MODIFICA
		}
	}
}
/* Per la versione di inde 10.1
WebForm.prototype.RealizeMessages = function()
{ 
  // Se non sono stata ancora realizzata, lascio perdere
  if (!this.Realized)
    return;
  //
  // Se non mostro messaggi, non realizzo niente!
  if (!this.ShowMessages())
  {
    if (RD3_Glb.IsIE())
	this.MessagesBox.style.display = "none";
    return;
  }
  if (RD3_Glb.IsIE())
	this.MessagesBox.style.display = "";
  //
  var n = this.Messages.length;
  for (var i=0; i<n; i++)
  {
    if (!this.Messages[i].Realized)
      this.Messages[i].Realize(this.MessagesBox);
  }
  //
  // Rimuovo i messaggi temporanei
  for (var i=n-1; i>=0; i--)
  {
    if (this.Messages[i].Temporary)
    {
      // Se il messaggio riguarda un'altra richiesta lo elimino
      if (this.Messages[i].Request != RD3_DesktopManager.CurrentRequest)
      {
        if (i==0)
        {
          // Sono l'ultimo messaggio temporaneo.. devo verificare se ci sono altri messaggi dopo di me..
          var l = this.Messages.length;
          if (l==1 && this.HasInfoMessages())
          {
            // Non ci sono altri messaggi ma l'altezza rimane fissa: 
            // devo fare il fading e non sparire di colpo
            fx = new GFX("lastmessage", true, this.Messages[i], this.Animating, null, this.LastMessageAnimDef);
            RD3_GFXManager.AddEffect(fx);
            //
            // Tolgo il messaggio dall'array: alla fine del fading verra' fatto l'unrealize..
            this.Messages.splice(i,1);
          }
          else
          {
            this.Messages[i].Unrealize();
            this.Messages.splice(i,1);
          }
        }
        else
        {
          this.Messages[i].Unrealize();
          this.Messages.splice(i,1);
        }
      }
    }
  }
  //
  // Regolo l'altezza della messagesbox
  // Calcolo la dimensione dei messaggi
  n = this.Messages.length;
  var newheight = 0;
  for (var i=0; i<n; i++)
  {
    newheight += this.Messages[i].MyBox.offsetHeight;
    //
    // Mostro al massimo 3 messaggi insieme, dopo devono apparire le scrollbar (i messaggi partono da 0)
    if (i >= 2)
      break;
  }
  //
  // Decido la direzione dell'animazione
  var dir = true;  
  if (n==0 && this.HasInfoMessages())
  {
    newheight = RD3_ClientParams.MinMessagesBoxHeight;
  }
  //
  // Calcolo la vecchia altezza (togliendo il bordo inferiore)
  var oldh = this.MessagesBox.offsetHeight;
  oldh = oldh<=0 ? 0 : oldh-1;
  dir = oldh<=newheight;
  //
  if (newheight != oldh && !this.Animating)
  {
    // Se cambia la dimensione della barra avvio l'animazione relativa al fold dei messaggi
    fx = new GFX("message", dir, this, this.Animating, null, this.MessageAnimDef);
    fx.NewHeight = newheight;
    fx.OldHeight = oldh;
    RD3_GFXManager.AddEffect(fx);
  }
  //
  // Se sto animando imposto direttamente la nuova dimensione..
  if (this.Animating)
  {
    this.MessagesBox.style.height = newheight + "px";
    //
    // Se e' alta 0 devo togliere anche il bordo, se non c'e' una riga di troppo..
    this.MessagesBox.style.borderBottomWidth = newheight==0 ? "0px" : "";
  }
}
*/

// ********************************************************************************
//  Realizzo tutti i messaggi non ancora realizzati
// ********************************************************************************
WebForm.prototype.RealizeMessages = function()
{ 
  // Se non sono stata ancora realizzata, lascio perdere
  if (!this.Realized)
    return;
	
	
	
  //
  // Se non mostro messaggi, non realizzo niente!
 if (!this.ShowMessages())
  {
    if (RD3_Glb.IsIE())
	this.MessagesBox.style.display = "none";
    return;
  }
  if (RD3_Glb.IsIE())
	this.MessagesBox.style.display = "";
  //
  var n = this.Messages.length;
  for (var i=0; i<n; i++)
  {
    if (!this.Messages[i].Realized)
      this.Messages[i].Realize(this.MessagesBox);
  }
  //
  // Rimuovo i messaggi temporanei
  for (var i=n-1; i>=0; i--)
  {
    if (this.Messages[i].Temporary)
    {
      // Se il messaggio riguarda un'altra richiesta lo elimino
      if (this.Messages[i].Request != RD3_DesktopManager.CurrentRequest)
      {
        if (i==0)
        {
          // Sono l'ultimo messaggio temporaneo.. devo verificare se ci sono altri messaggi dopo di me..
          var l = this.Messages.length;
          if (l==1 && this.HasInfoMessages())
          {
            // Non ci sono altri messaggi ma l'altezza rimane fissa: 
            // devo fare il fading e non sparire di colpo
            fx = new GFX("lastmessage", true, this.Messages[i], this.Animating, null, this.LastMessageAnimDef);
            RD3_GFXManager.AddEffect(fx);
            //
            // Tolgo il messaggio dall'array: alla fine del fading verra' fatto l'unrealize..
            this.Messages.splice(i,1);
          }
          else
          {
            this.Messages[i].Unrealize();
            this.Messages.splice(i,1);
          }
        }
        else
        {
          this.Messages[i].Unrealize();
          this.Messages.splice(i,1);
        }
      }
    }
  }
  //
  // Regolo l'altezza della messagesbox
  // Calcolo la dimensione dei messaggi
  n = this.Messages.length;
  var newheight = 0;
  for (var i=0; i<n; i++)
  {
    newheight += this.Messages[i].MyBox.offsetHeight;
    //
    // Mostro al massimo 3 messaggi insieme, dopo devono apparire le scrollbar (i messaggi partono da 0)
    if (i >= 2)
      break;
  }
  //
  // Decido la direzione dell'animazione
  var dir = true;  
  if (n==0 && this.HasInfoMessages())
  {
    newheight = RD3_ClientParams.MinMessagesBoxHeight;
  }
  //
  // Calcolo la vecchia altezza (togliendo il bordo inferiore)
  var oldh = this.MessagesBox.offsetHeight;
  oldh = oldh<=0 ? 0 : oldh-1;
  dir = oldh<=newheight;
  //
  if (newheight != oldh && !this.Animating)
  {
    // Se cambia la dimensione della barra avvio l'animazione relativa al fold dei messaggi
    fx = new GFX("message", dir, this, this.Animating, null, this.MessageAnimDef);
    fx.NewHeight = newheight;
    fx.OldHeight = oldh;
    RD3_GFXManager.AddEffect(fx);
  }
  //
  // Se sto animando imposto direttamente la nuova dimensione..
  if (this.Animating)
  {
    this.MessagesBox.style.height = newheight + "px";
    //
    // Se e' alta 0 devo togliere anche il bordo, se non c'e' una riga di troppo..
    this.MessagesBox.style.borderBottomWidth = newheight==0 ? "0px" : "";
  }
}




// **************************************************************
// PATCH 24 Collasso gruppi
// **************************************************************
PGroup.prototype.LoadProperties = function(node)
{
  //************************************
  var val = node.getAttribute("col");
  if (val=="0" || val=="1")
  {
    node.removeAttribute("col");
    node.setAttribute("col", val);
  }
  //*************************************
  //
  // Ciclo su tutti gli attributi del nodo
  var attrlist = node.attributes;
  var n = attrlist.length;
  for (var i=0; i<n; i++)
  {
    var attrnode = attrlist.item(i);
    var nome = attrnode.nodeName;
    var valore = attrnode.nodeValue;
    //
    switch(nome)
    {
      case "flg": this.SetFlags(parseInt(attrnode.nodeValue)); break;
      case "img": this.SetImage(attrnode.nodeValue); break;
      case "cap": this.SetHeader(attrnode.nodeValue); break;
      case "tip": this.SetTooltip(attrnode.nodeValue); break;
      case "lle": this.SetListLeft(parseInt(attrnode.nodeValue)); break;
      case "lto": this.SetListTop(parseInt(attrnode.nodeValue)); break;
      case "lwi": this.SetListWidth(parseInt(attrnode.nodeValue)); break;
      case "lhe": this.SetListHeight(parseInt(attrnode.nodeValue)); break;
      case "fle": this.SetFormLeft(parseInt(attrnode.nodeValue)); break;
      case "fto": this.SetFormTop(parseInt(attrnode.nodeValue)); break;
      case "fwi": this.SetFormWidth(parseInt(attrnode.nodeValue)); break;
      case "fhe": this.SetFormHeight(parseInt(attrnode.nodeValue)); break;
      case "pag": this.SetPage(parseInt(attrnode.nodeValue)); break;
      case "lhp": this.SetListHeaderPosition(parseInt(attrnode.nodeValue)); break;
      case "fhp": this.SetFormHeaderPosition(parseInt(attrnode.nodeValue)); break;
      case "hhe": this.SetHeaderHeight(parseInt(attrnode.nodeValue)); break;
      case "hwi": this.SetHeaderWidth(parseInt(attrnode.nodeValue)); break;
      case "inl": this.SetInlist(attrnode.nodeValue == "1"); break;
      case "sty": this.SetVisualStyle(parseInt(attrnode.nodeValue)); break;
      case "clp": this.SetCollapsible(valore=="1"); break;
      case "col": this.SetCollapsed(valore=="1"); break;
      case "mfl": this.SetListMovedFields(valore=="1"); break;
      case "mff": this.SetFormMovedFields(valore=="1"); break;
      //
      case "cla": this.CollapseAnimDef = valore; break;
      //
      case "id": 
        this.Identifier = valore;
        RD3_DesktopManager.ObjectMap.add(valore, this);
        
      break;
    }
  }
}

// ****************************************************************
// Crea un Flash Uploader
// ****************************************************************
PField.prototype.CreateFlashUploader = function()
{
  // Creo il contenitore che verra' rimpiazzato dal Flash
  var placeholder = document.createElement("div");
  //
  // Attacco momentaneamente l'immagine al DOM perche' per creare il Flash
  // vengono usati innerHTML e getElementById per recuperare l'object
  document.body.appendChild(placeholder);
  //
  var settings =
  {
    flash_url : "swfupload/swfupload.swf",
    file_size_limit : this.MaxUploadSize + " B",
    file_upload_limit : this.MaxUploadFiles,
    file_types : this.UploadExtensions,
    //
    // Configuro il bottone
    button_placeholder: placeholder,
    button_cursor : SWFUpload.CURSOR.HAND,
    button_window_mode : SWFUpload.WINDOW_MODE.TRANSPARENT,
    //
    // Imposto gli eventi
    swfupload_loaded_handler     : SWFUpload_OnLoaded,
    file_dialog_start_handler    : SWFUpload_OnDialogStart,
    file_queued_handler          : SWFUpload_OnFileQueued,
    file_queue_error_handler     : SWFUpload_OnFileQueueError,
    file_dialog_complete_handler : SWFUpload_OnFileDialogComplete,
    upload_start_handler         : SWFUpload_OnUploadStart,
    upload_progress_handler      : SWFUpload_OnUploadProgress,
    upload_error_handler         : SWFUpload_OnUploadError,
    upload_success_handler       : SWFUpload_OnUploadSuccess,
    upload_complete_handler      : SWFUpload_OnUploadComplete
  };
  //
  var uploadUrl = window.location.href.substring(0, window.location.href.length - window.location.search.length);
  uploadUrl += "?WCI=" + (this.MultiUpload ? "IWFiles" : "IWUpload");
  //
  if (this.MultiUpload)
    uploadUrl += "&WCE=" + this.ParentPanel.WebForm.Identifier;
  else
    uploadUrl += "&WCE=" + this.Identifier;
  //
  uploadUrl += "&SESSIONID=" + RD3_DesktopManager.WebEntryPoint.SessionID;
  //
  settings.upload_url = uploadUrl;
  //
  var appUrl = window.location.href.substring(0,window.location.href.lastIndexOf("/")+1);
  if (this.MultiUpload)
  {
    settings.button_image_url = appUrl + "images/find_sprite.gif";
    settings.button_action = SWFUpload.BUTTON_ACTION.SELECT_FILES;
    //
    if (RD3_ServerParams.Theme == "seattle")
    {
      settings.button_width = "22";
      settings.button_height = "22";
    }
    else
    {
      settings.button_width = "26";
      settings.button_height = "28";
    }
  }
  else
  {
	//Modifica per togliere l'immagine di default dell'upload
   // settings.button_image_url = appUrl + "images/upload_sprite.gif";
    settings.button_action = SWFUpload.BUTTON_ACTION.SELECT_FILE;
	//Abbiamo modificato la dimensione dell'icona upload file
	//INIZIO MODIFICA
    settings.button_width = "96";
    settings.button_height = "96";
	//FINE MODIFICA
  }
  //
  if (this.UploadDescription.length>0)
    settings.file_types_description = this.UploadDescription;
  //
  // Creo il Flash
  FlashUploader = new SWFUpload(settings);
  FlashUploader.ParentField = this;
  return FlashUploader;
}



// ********************************************************************************
// PATCH 26 - NPQ 2096 - VERSIONE 10.1 - 10.5
// ********************************************************************************

PGroup.prototype.FindObjectsUnderMe = function(flColl)
{
  this.MyFields = new Array();
  this.FieldsUnderMe = new Array();
  //
  var pan = this.ParentPanel;
  var n = pan.Fields.length;
  //
  for (var i=0; i<n; i++)
  {
    var fld = pan.Fields[i];
    //
    // ****************************
    if (fld.Page != this.Page)
      continue;
    // ****************************
    //
    var o = (fld.Group ? fld.Group : fld);
    if (pan.PanelMode == RD3_Glb.PANEL_LIST && fld.InList && !fld.ListList)
    {
      // Se il campo fa parte del gruppo
      if (fld.Group == this)
      {
        this.MyFields.push(fld);
      }
      else
      {
        // Se sta sotto del gruppo e non sporge ne a sinistra ne a destra del gruppo
        var h = (flColl ? 0 : this.ListHeight);
        if ((this.ListTop + h <= o.ListTop) && (this.ListLeft <= o.ListLeft) && (this.ListLeft + this.ListWidth >= o.ListLeft + o.ListWidth))
        {
          this.FieldsUnderMe.push(fld);
        }
      }
    }
    else if (pan.PanelMode == RD3_Glb.PANEL_FORM && fld.InForm)
    {
      // Se il campo fa parte del gruppo
      if (fld.Group == this)
      {
        this.MyFields.push(fld);
      }
      else
      {
        // Se sta sotto del gruppo e non sporge ne a sinistra ne a destra del gruppo
        var h = (flColl ? 0 : this.FormHeight);
        if ((this.FormTop + h <= o.FormTop) && (this.FormLeft <= o.FormLeft) && (this.FormLeft + this.FormWidth >= o.FormLeft + o.FormWidth))
        {
          this.FieldsUnderMe.push(fld);
        }
      }
    }
  }
}


// *********************************************************
// Imposta la proprieta' Collapsed
// *********************************************************
PGroup.prototype.SetCollapsed = function(value, evento) 
{
  var old = this.Collapsed;
  //
  if (value!=undefined)
    this.Collapsed = value;
  //
  if (this.Realized && (old!=this.Collapsed || value==undefined))
  {
    var LayoutList = (this.ParentPanel.PanelMode == RD3_Glb.PANEL_LIST);
    //
    // Aggiorno l'immagine corretta per il pulsante collapse
    var imgSrc = RD3_Glb.GetImgSrc("images/gr" + (this.Collapsed ? "xp" : "cl") +".gif");
    if (LayoutList && this.ListCollapseButton)
      if (!RD3_Glb.IsMobile()) this.ListCollapseButton.src = imgSrc;
    if (!LayoutList && this.FormCollapseButton)
      if (!RD3_Glb.IsMobile()) this.FormCollapseButton.src = imgSrc;
    //
    // Decido se devo spostare i campi:
    var MoveFields = true;
    //
    // Se l'evento viene dal server controllo che i campi non siano gia' stati spostati
    if (!evento)
      MoveFields = !(LayoutList ? this.ListMovedFields : this.FormMovedFields);
    //
    // Controllo se nel layout e' cambiato Collapsed
    var WasCollapsed = ((LayoutList ? this.WasLCollapsed : this.WasFCollapsed) == true);
    if (MoveFields && value == undefined)
    {
      if (this.Collapsed != WasCollapsed)
        this.CalcLayout();
      else
        MoveFields = false;
    }
    //
    // Cerco i miei campi e quelli sotto di me
    this.FindObjectsUnderMe(WasCollapsed);
    //
    // Mi memorizzo Collapsed per il layout corrente
    if (LayoutList)
      this.WasLCollapsed = this.Collapsed;
    else
      this.WasFCollapsed = this.Collapsed;
    //
    // Ora, posso spostare i campi
    if (MoveFields)
    {
      // Calcolo di quanto devo muovere gruppo e campi sottostanti
      var deltaH = (LayoutList ? this.ListHeight : this.FormHeight);
      if (this.Collapsed)
        deltaH = -deltaH;
      //
      // Notifico gli eventi degli spostamenti dei campi sotto di me
      // Gli spostamenti reali verranno fatti dall'animazione
      n = this.FieldsUnderMe.length;
      for (var i=0; i<n; i++)
      {
        var fld = this.FieldsUnderMe[i];
        if (LayoutList)
        {
          var ev = new IDEvent("resize", fld.Identifier, evento, RD3_Glb.EVENT_SERVERSIDE, "list", fld.ListWidth, fld.ListHeight, fld.ListLeft, fld.ListTop + deltaH);
        }
        else
        {
          var ev = new IDEvent("resize", fld.Identifier, evento, RD3_Glb.EVENT_SERVERSIDE, "form", fld.FormWidth, fld.FormHeight, fld.FormLeft, fld.FormTop + deltaH);
        }
      }
    }
    //



// INIZIO CORREZIONE Assistenza 001269-2011

    // Notifico l'evento di cambio Collapsed avvenuto
    // Se il server e' gia' allineato l'evento glielo mando in differita
    // perche' dovra' comunque essere informato del fatto che ho spostato i campi
    var evt = (old == this.Collapsed ? RD3_Glb.EVENT_DEFERRED : RD3_Glb.EVENT_ACTIVE);
  	var ev = new IDEvent("grpcol", this.Identifier, evento, evt, !this.Collapsed ? "exp" : "col");

// FINE CORREZIONE Assistenza 001269-2011



    //
    // Imposto l'animazione, saltandola se non ho un valore (sono dentro la realize)
    fx = new GFX("group", this.Collapsed, this, (value==undefined) || this.ParentPanel.WebForm.Animating || !MoveFields, null, this.CollapseAnimDef);
    fx.Immediate = true;
    //
    // Comunico all'animazione se deve spostare i campi
    fx.MoveFields = MoveFields;
    //
    RD3_GFXManager.AddEffect(fx);
    //
    // Se mi sono espanso aggiorno i miei campi
    if (old != this.Collapsed && !this.Collapsed)
    {
      var n = this.ParentPanel.Fields.length;
      for (var i=0; i<n; i++)
      {
        var fld = this.ParentPanel.Fields[i];
        if (fld.Group == this && fld.PValues[1])
          fld.PValues[1].UpdateScreen();
      }
    }
  }
}


// ********************************************************************************
// PATCH 30 - ASS 1398-2011
// ********************************************************************************
PField.prototype.OnClickCaption= function(evento)
{ 
  RD3_DDManager.LastActForm = this.ParentPanel.WebForm;
  //
  if (this.IsStatic())
  {
    // Un campo statico e' cliccabile se e' abilitato oppure se e' attivo il flag ActivableDisabled e il suo visual style ha il flag cliccabile
    if ((this.IsEnabled() || this.ActivableDisabled) && !this.SubFrame && this.VisualStyle.HasHyperLink())
    {
	//*******
	  // Se non sono un bottone devo dare il fuoco al wep, in modo da far scattare gli automatismi dei campi attivi...
	  if (this.VisualStyle.GetContrType()!=6)
	  {
	    document.body.focus();
	  }
	  //**************
	  //
      // Se e' collegato ad un comando, lo lancio adesso
      if (this.Command)
      {
        this.Command.OnClick(evento);
      }
      else
      {
        // Altrimenti lancio evento normale
        var ev = new IDEvent("clk", this.Identifier, evento, this.ClickEventDef, null, "cap");
      }
    }
	//return true;
  }
  else if (this.ParentPanel.CanSort && this.CanSort && this.VisCanSort() && this.ListList)
  {
    var sendev = true;
    //
    // Su firefox il doppio click sull'area di resize fa partire anche il click.. percio'
    // qui devo verificare di non essere nell'area di resize per mandare il click al server
    if (RD3_Glb.IsFirefox())
    {
      var objpos = RD3_Glb.GetScreenLeft(this.ListCaptionBox) + this.ListCaptionBox.clientWidth;
      //
      // Verifico se sono nell'area di resize, se il pannello ha il resize delle colonne attivo e se il pannello e' in lista: in questo caso non mando il sort, perche' prima di me e' passato il doppio click
      if ((objpos-evento.clientX<=RD3_ClientParams.ResizeLimit) && this.ParentPanel.CanResizeColumn && this.ParentPanel.PanelMode==0)
        sendev = false;
    }
    //
    // Lancio il click solo se il pannello ha il sort attivo
    if (sendev)
      var ev = new IDEvent("clk", this.Identifier, evento, this.ClickEventDef, null, "cap");
    //
    // Lato client non posso fare nulla...
  }
}

// ASS 001450-2011 - PATCH 35
KBManager.prototype.IDRO_KeyDown = function (ev)
{
  // Giro il messaggio al DDManager
  RD3_DDManager.OnKeyDown(ev);
  //
  var eve = (window.event)?window.event:ev;
  var code = (eve.charCode)?eve.charCode:eve.keyCode;
  var srcobj = (window.event)?eve.srcElement:eve.explicitOriginalTarget;
  var cell = this.GetCell(srcobj);
  var en = cell.IsEnabled;
  var msk = cell.Mask;
  var listGroup = this.IsListGroup(srcobj);
  //
  if (cell)
    cell.RemoveWatermark();
  //
  // Gestione selezione testuale
  var pobj = this.GetObject(srcobj);
  if (pobj && pobj.SendtextSelChange && pobj.UseTextSel)
  {
    // Se c'e' gia' un timer lo blocco (improbabile.. ma per sicurezza facciamolo)
    if (this.SelTextTimer)
    {
      window.clearTimeout(this.SelTextTimer);
      this.SelTextSrc = null;
      this.SelTextObj = null;
    }
    //
    // Attivo il timer per fare scattare la gestione della selezione testuale dopo 10 milli: in questo modo il campo ha sempre il testo aggiornato
    this.SelTextTimer = window.setTimeout(new Function("ev","if (RD3_KBManager.SelTextObj && RD3_KBManager.SelTextObj.SendtextSelChange){RD3_KBManager.SelTextObj.SendtextSelChange(RD3_KBManager.SelTextSrc);}"), 50);
    this.SelTextSrc = srcobj;
    this.SelTextObj = pobj;
  }
  //
  // Controllo ALT + tasto in caso di menu a tendina (anche tasto ESC)
  var co = (RD3_DesktopManager.WebEntryPoint && RD3_DesktopManager.WebEntryPoint.CmdObj.MenuBarOpen);
  if ((eve.altKey || co) && ((code>=48 && code<=90)||code==27))
  {
    if (RD3_DesktopManager.WebEntryPoint.CmdObj.HandleAccell(eve,code))
    {
      this.CheckKey(srcobj, eve);
      RD3_Glb.StopEvent(eve);
      return false;
    }
  }
  //
  // Controllo CTRL-ESC per menu' taskbar
  var mt = (RD3_DesktopManager.WebEntryPoint)?RD3_DesktopManager.WebEntryPoint.MenuType:0;
  if ((eve.ctrlKey && code==RD3_ClientParams.TaskMenuAccellCode) && mt==RD3_Glb.MENUTYPE_TASKBAR)
  {
    RD3_DesktopManager.WebEntryPoint.OnStartClick(eve);
  }  
  //
  // Controllo tasti di navigazione (frecce+tab)
  if (((code>=33 && code<=40) || code==9) && !RD3_DDManager.OpenCombo)
  {
    var obj = this.GetObject(srcobj);
    if (obj && obj.HandleNavKeys && this.CanHandleKeys(obj))
    {
      // Sto per gestire un tasto, prima di farlo controllo che l'oggetto
      // non sia stato anche modificato. In questo caso prima gestisco la modifica,
      // poi la pressione del tasto
      if (RD3_Glb.IsEditFld(srcobj) && !listGroup)
      {
        // Se premo SHIFT e mi sto muovendo (LEFT/RIGHT/TOP/END) dentro al campo non mi interessa
        // controllare le modifiche... tanto non posso uscire dal campo... sto solo selezionando
        var checkChange = true;
        if (eve.shiftKey && (code==37 || code==39 || code==35 || code==36))
          checkChange = false;
        //
        if (checkChange)
          this.IDRO_OnChange(eve);
      }
      else if ((code==33 || code==34) && RD3_Glb.IsChrome() && srcobj && srcobj.tagName=='TEXTAREA')
      {
        // PageUP/PageDOWN su Textarea su Chrome fa scrollare tutta la pagina
        eve.preventDefault();
        //
        // Scrollo io
        srcobj.scrollTop = srcobj.scrollTop + (code==33 ? -1 : 1) * (srcobj.clientHeight - 6);
      }
      //
      if (obj.HandleNavKeys(eve))
      {
        this.CheckKey(srcobj, eve);
        RD3_Glb.StopEvent(eve);
        return false; // Se il tasto e' stato gestito non devo piu' gestire l'evento
      }
    }
  }
  //
  // Controllo tasti FK
  if (code>=112 && code<=123)
  {
    var obj = this.GetObject(srcobj);
    if (obj && obj.HandleFunctionKeys  && this.CanHandleKeys(obj))
    {
      //**************************************************
      // Su chrome rimane in canna l'evento di change, e questo fa si che se stiamo gestendo il layout automatico 
      // riscatta l'onchange suo dopo.. allora togliamo il fuoco e lo rimettiamo all'oggetto.. in questo modo il suo evento scatta e poi non ci rompe più..
      if (RD3_Glb.IsChrome())
      {
        try
      	{
      		srcobj.blur();
      		srcobj.focus();
      	}
      	catch(ex) {}
      }
      //***********************************
      //
      // Sto per gestire un tasto, prima di farlo controllo che l'oggetto
      // non sia stato anche modificato. In questo caso prima gestisco la modifica,
      // poi la pressione del tasto
      this.IDRO_OnChange(eve);
      //
      if (obj.HandleFunctionKeys(eve))
      {
        this.CheckKey(srcobj, eve);
        RD3_Glb.StopEvent(eve);
        return false; // Se il tasto e' stato gestito non devo piu' gestire l'evento
      }
    }
  }  
  //
  // Campo abilitato (e non gruppo in lista)...
  if (en && !listGroup)
  {
    // Gestisco masked input o non devo fare nulla?
    var ok = true;
    if (msk && RD3_Glb.IsEditFld(srcobj))
    {
      ok = hk(ev);
      this.CheckKey(srcobj, eve);
      if (!ok)
        RD3_Glb.StopEvent(eve); 
    }
    else
      this.CheckKey(srcobj, eve);
    //
    var obj = this.GetObject(srcobj);
    //
    // Se l'oggetto non e' nella form giusta blocco i tasti
    if (obj && !this.CanHandleKeys(obj))
      RD3_Glb.StopEvent(eve); 
    //
    // Ho premuto un tasto: il campo e' superattivo? (la gestione non la faccio per le date o le ore o le combo value sourc)
    if (obj && obj.SuperActive && !RD3_Glb.IsDateOrTimeObject(obj.DataType) && !obj.HasValueSource)
    {
      // Se c'e' gia' un timer lo blocco (improbabile.. ma per sicurezza facciamolo)
      if (this.SuperActiveTimer)
      {
        window.clearTimeout(this.SuperActiveTimer);
        this.SuperActiveSrc = null;
      }
      //
      // Attivo il timer per fare scattare l'OnChange dopo 10 milli: in questo modo il campo ha sempre il testo aggiornato e la SendChanges di PValue puo' funzionare
      this.SuperActiveTimer = window.setTimeout(new Function("ev","return RD3_KBManager.IDRO_OnChange(RD3_KBManager.SuperActiveSrc)"), 10);
      this.SuperActiveSrc = srcobj;
    }
    //
    return ok;
  }
  //
  // CTRL+C permesso
  if (eve.ctrlKey && code==67)
    return true;
  //
  this.CheckKey(srcobj, eve);
  //
  // Pressione tasto ENTER su campo monorow permessa
  if (srcobj.tagName=="INPUT" && code==13)
    return true;
  //
  // Tasti TAB e FRECCE permessi
  if (code==9 || (code>=35 && code<=40))
  {
    return true;
  }
  else
  {
    RD3_Glb.StopEvent(eve);
    return false;
  }
}
// ASS 001450-2011 - PATCH 35 - END

// ASS 001025-2012- CANCELLAZIONE FUOCO COMBO
PCell.prototype.OnComboChange = function(save, forcesend, superact)
{
  var oldText = this.Text;
  //
  // Mi copio il valore attualmente presente nella combo
  this.Text = this.IntCtrl.GetComboValue();
  //
  // Se la combo e' stata chiusa giro il messaggio al PValue
  if (save && this.PValue)
  {
    var obj = this.IntCtrl.GetDOMObj();
    var flag = ((save && this.ParentField.HasValueSource) || forcesend ? RD3_Glb.EVENT_IMMEDIATE : 0)
    if (this.ParentField.HasValueSource && this.ParentField.SuperActive && superact)
      flag = RD3_Glb.EVENT_SERVERSIDE;
    //
    this.PValue.SendChanges(obj, flag);
    //
    // Se e' una LKE attiva, mi ricordo che la combo e' in fase di editing
    // pero' solo se e' effettivamente cambiato
	// ********************************* PARTE MODIFICATA
    if (this.ParentField.LKE && oldText!=this.Text)
      this.ComboEditing = true;
	// ********************************* PARTE MODIFICATA
  }
}
// ASS 001025-2012- end




//Tolgo il tasto di cancellazione nell'upload dei files


// *********************************************************************************
// Gestisce la visualizzazione o meno dei pulsanti della Toolbar
// *********************************************************************************
PField.prototype.UpdateToolbar = function()
{
  if (this.DataType==10) // BLOB
  {
    var upl = false;
    var del = false;
    var zom = false;
    //
    var pv = this.PValues[this.ParentPanel.ActualPosition+this.ParentPanel.ActualRow];
    //
    if (this.ParentPanel.IsGrouped())
      pv = this.PValues[this.ParentPanel.GetRowIndex(this.ParentPanel.ActualRow)];
    //
    var mim = (pv)?pv.BlobMime:null;
    if (!mim)
      mim = "empty";
    //
    // Se sono abilitato e non in QBE, mostro anche la cancellazione/caricamento, ma solo se non sono su una riga vuota
    var m = this.ParentPanel.ActualPosition + this.ParentPanel.ActualRow;
    //
    if (this.ParentPanel.IsGrouped() && pv)
      m = pv.Index;
    //
    if (this.IsEnabled(m+1) && this.ParentPanel.Status!=RD3_Glb.PS_QBE && !this.ParentPanel.IsNewRow(this.ParentPanel.ActualPosition, this.ParentPanel.ActualRow))
    {
      upl = this.ParentPanel.IsCommandEnabled(RD3_Glb.PCM_BLOBEDIT);
	  //INIZIO MODIFICA ---------
      // del = this.ParentPanel.IsCommandEnabled(RD3_Glb.PCM_BLOBDELETE);        
	  //FINE MODIFICA
    }
    //
    if (mim!="empty" && mim!="upload")
      zom = this.ParentPanel.IsCommandEnabled(RD3_Glb.PCM_BLOBSAVEAS);
    //
    // Mostro o nascondo fisicamente i campi
    RD3_Glb.SetDisplay(this.ListBlobUploadImg,(upl)?"":"none");
    RD3_Glb.SetDisplay(this.FormBlobUploadImg,(upl)?"":"none");
    RD3_Glb.SetDisplay(this.ListBlobDeleteImg,(del)?"":"none");
    RD3_Glb.SetDisplay(this.FormBlobDeleteImg,(del)?"":"none");
    RD3_Glb.SetDisplay(this.ListBlobZoomImg,(zom)?"":"none");
    RD3_Glb.SetDisplay(this.FormBlobZoomImg,(zom)?"":"none");
    //
    // Posiziono i campi
    var tw = RD3_ClientParams.BlobButtonWidth *((upl?1:0)+(del?1:0)+(zom?1:0));
    //
    // Lavoro per la form
    if (this.FormBlobUploadImg)
    {
      var top = 0;
      var left = this.FormCaptionBox.clientWidth - tw;
      if (!this.HdrFormAbove)
      {
        top = 20;
        left = 0;
      }
      //
      if (upl)
      {
        this.FormBlobUploadImg.style.left = left + "px";
        this.FormBlobUploadImg.style.top = top + "px";
        left+=RD3_ClientParams.BlobButtonWidth;
      }
      if (del)
      {
        this.FormBlobDeleteImg.style.left = left + "px";
        this.FormBlobDeleteImg.style.top = top + "px";
        left+=RD3_ClientParams.BlobButtonWidth;
      }
      if (zom)
      {
        this.FormBlobZoomImg.style.left = left + "px";
        this.FormBlobZoomImg.style.top = top + "px";
        left+=RD3_ClientParams.BlobButtonWidth;
      }
    }
    //
    // Lavoro per la list
    if (this.ListBlobUploadImg)
    {
      var top = 0;
      var left = this.ListCaptionBox.clientWidth - tw;
      if (!this.HdrListAbove)
      {
        top = 20;
        left = 0;
      }
      //
      if (upl)
      {
        this.ListBlobUploadImg.style.left = left + "px";
        this.ListBlobUploadImg.style.top = top + "px";
        left+=RD3_ClientParams.BlobButtonWidth;
      }
      if (del)
      {
        this.ListBlobDeleteImg.style.left = left + "px";
        this.ListBlobDeleteImg.style.top = top + "px";
        left+=RD3_ClientParams.BlobButtonWidth;
      }
      if (zom)
      {
        this.ListBlobZoomImg.style.left = left + "px";
        this.ListBlobZoomImg.style.top = top + "px";
        left+=RD3_ClientParams.BlobButtonWidth;
      }    
    }
  }
}

// 001852-2012 : Aprire smartlookup con quello scritto dall'utente
PCell.prototype.OnComboActivatorClick = function(forceOpenCombo)
{
  // Se una combo LKE ha anche un oggetto di attivazione associato, allora clicco sempre sull'attivatore
  // Lo stesso faccio se me lo chiedono... per esempio perche' ho premuto CTRL-F2 nella combo.. in questo
  // caso voglio comunque aprire la combo LKE anche se c'e' un oggetto di attivazione associato
  if (this.ParentField.LKE && this.IsEnabled && (forceOpenCombo || !this.ParentField.CanActivate))
  {
    // Memorizzo * nel mio text, cosi' PValue non mi rompe le scatole ed io non rompo la combo
    // Tanto questo e' quel che succedera' dopo l'evento
    //***********************************************************************
    if (this.Text == "") // || this.Text==this.IntCtrl.OriginalText)
      this.Text = "*";
    //***********************************************************************
    //
    // Se e' multi-selezionabile invio anche la selezione attuale
    var txt = "";
    if (this.IntCtrl.MultiSel)
    {
      txt += this.IntCtrl.GetComboFinalName(true);
      txt += (txt.length > 0 && this.Text.length > 0 ? ";" : "");
    }
    txt += this.Text
    //
    // In questo caso "simulo" un * confermato... che fa apparire la combo
    var ev = new IDEvent("chg", this.PValue.Identifier, null, this.ParentField.ChangeEventDef|RD3_Glb.EVENT_IMMEDIATE, "", txt);
  }
  else
  {
    // Invio al server l'evento di click sull'attivatore (click sul pvalue)
    if (this.ParentField.HasValueSource && this.ParentField.SuperActive)
      var ev = new IDEvent("clk", this.PValue.Identifier, null, RD3_Glb.EVENT_SERVERSIDE, "", "", "", "", "", RD3_ClientParams.SuperActiveDelay, true);
    else
      var ev = new IDEvent("clk", this.PValue.Identifier, null, this.ParentField.ClickEventDef);
  }
}
// 001852-2012 : END


//Patch 000705-2013 per il malfunzionamento dei tooltip dovuto alla 12
MessageTooltip.prototype.SetImage = function(value)
{
  if (value != undefined)
    this.Image = value;
  //
  if (this.Realized)
  {
    if (this.Image == "")
      this.ImgObj.style.display = "none";
    else
    {
      this.ImgObj.src = RD3_Glb.GetImgSrc(this.Image);
      this.ImgObj.style.display = "inline";
    }
  }
}

