//**********************************
// Assistenza 001285-2017
// Videate che in apertura generano errori javascript
// Verrà corretto in un prossimo rilascio della 16.5
//**********************************
IDPanel.prototype.AdaptLayout = function()
{ 
  // Per migliorare le performance, elimino la listlistbox dal dom (non per IE6 che ha problemi con i check box!)
  var refoc = null;
  var removeFromDOM = (RD3_Glb.IsIE(10, false) && !RD3_Glb.IsIE(6) && this.PanelMode==RD3_Glb.PANEL_LIST && this.FixedColumns==0);
  if (removeFromDOM)
  {
    // Se l'oggetto che aveva il fuoco era dentro al pannello, IE lo perde!
    var oldActiveElem = document.activeElement;
    //
    this.ContentBox.removeChild(this.ListBox);
    //
    if (document.activeElement != oldActiveElem)
      refoc = oldActiveElem;
  }
  //
  // Se presenti dimensiono le linguette delle pagine
  // Lo faccio prima della chiamata alla classe base in modo che
  // essa puo' mettere a posto bene il content box
  if (this.Pages.length > 0)
  {
    // Se sono dentro una Tab prima di fare l'adattamento delle pagine devo dimensionare correttamente il FrameBox
    // se no vengono disegnate male..
    if (this.ParentTab)
    {
      RD3_Glb.AdaptToParent(this.FrameBox, 0, 0);
    }
    //
    this.AdaptPagesLayout();
  }
  //
  var res = this.SendResize;
  //
  // Chiamo la classe base
  var flDontCheckSB = false;
  WebFrame.prototype.AdaptLayout.call(this);
  //
  // Non dovrei ridimensionare... Pero' se ho posticipato un resize lo devo fare comunque
  if (!res)
  {
    res |= (this.PanelMode==RD3_Glb.PANEL_FORM && (this.MustResizeFormW || this.MustResizeFormH)) | 
           (this.PanelMode==RD3_Glb.PANEL_LIST && (this.MustResizeListW || this.MustResizeListH));
  }
  //
  if (res || (this.ResVisFld && this.ResOnlyVisFlds))
  {
    // A parte Safari, gli altri brw calcolano immediatamente la scrollbar nel contentbox
    if (!RD3_Glb.IsSafari() && this.DeltaW<0)
      flDontCheckSB = true;
    //
    // Chiamo il resize dei campi in form e in lista
    if (this.HasForm)
    {
      // Dunque... ho la form... se sono in form, ridimensiono la form... Se avevo posticipato il resize prendo
      // i delta che non ho fatto... se, invece, il layout attivo non e' quello giusto mi ricordo che quando cambiero'
      // layout dovro' ridimensionare il layout form
      if (this.PanelMode==RD3_Glb.PANEL_FORM && this.Visible)
      {
        if (!this.DeltaW && this.MustResizeFormW) this.DeltaW = this.MustResizeFormW;
        if (!this.DeltaH && this.MustResizeFormH) this.DeltaH = this.MustResizeFormH;
        this.ResizeForm();
        this.MustResizeFormW = 0;
        this.MustResizeFormH = 0;
      }
      else if (this.LastFormResizeW==0 && (this.DeltaW || this.DeltaH))   // Solo se non ho mai resizato il layout form... mi ricordo di questi delta
      {
        this.MustResizeFormW = (this.MustResizeFormW==undefined ? 0 : this.MustResizeFormW) + this.DeltaW;
        this.MustResizeFormH = (this.MustResizeFormH==undefined ? 0 : this.MustResizeFormH) + this.DeltaH;
      }
    }
    if (this.HasList)
    {
      // Dunque... ho la lista... se sono in list, ridimensiono la lista... Se avevo posticipato il resize prendo
      // i delta che non ho fatto... se, invece, il layout attivo non e' quello giusto mi ricordo che quando cambiero'
      // layout dovro' ridimensionare il layout list
      if (this.PanelMode==RD3_Glb.PANEL_LIST && this.Visible)
      {
        if (!this.DeltaW && this.MustResizeListW) this.DeltaW = this.MustResizeListW;
        if (!this.DeltaH && this.MustResizeListH) this.DeltaH = this.MustResizeListH;
        //
        // Se ho un resize non applicato lo devo considerare quando faccio i calcoli del delta.
        // Solo quando non sono attive le animazioni, altrimenti il codice li considera correttamente
/*        if (!RD3_ClientParams.EnableGFX && this.DeltaH != 0 && !this.MustResizeListH)
          this.DeltaH += this.MustResizeListH;
	  */
        //
        this.ResizeList();
        this.MustResizeListW = 0;
        this.MustResizeListH = 0;
      }
      else if (this.LastListResizeW==0 && (this.DeltaW || this.DeltaH))   // Solo se non ho mai resizato il layout lista... mi ricordo di questi delta
      {
        this.MustResizeListW = (this.MustResizeListW==undefined ? 0 : this.MustResizeListW) + this.DeltaW;
        this.MustResizeListH = (this.MustResizeListH==undefined ? 0 : this.MustResizeListH) + this.DeltaH;
      }
    }
    this.DeltaW = 0;
    this.DeltaH = 0;
    this.SetActualPosition();
    //
    if (RD3_Glb.IsMobile())
      this.RefreshToolbar = true;
  }
  this.ResVisFld = false;
  //
  // Aggiusto il layout
  if (this.PanelMode==RD3_Glb.PANEL_LIST)
  {
    this.CalcListLayout(flDontCheckSB);
    if (this.IsGrouped())
      this.CalcListGroupLayout();
  }
  //
  // Aggiusto il layout dei gruppi
  this.CalcGroupsLayout();
  //
  // Passo la palla ai figli, che potrebbero avere dei subframes
  // Se sono su IE, vedo se qualche campo ha un Sub-Frame... Se e' cosi' devo
  // rimettere subito nel DOM il pannello, altrimenti non funziona bene il resize...
  // Pero', se lo faccio dopo, e' molto piu' veloce
  var restoreListInDom = true;
  var n = this.Fields.length;
  for (var i=0; i<n; i++)
  {
    var f = this.Fields[i];
    //
    if (removeFromDOM && restoreListInDom && f.SubFrame && f.SubFrame.Realized && f.IsVisible())
    {
      // Hai... devo ripristinarlo qui!
      this.ContentBox.appendChild(this.ListBox);
      restoreListInDom = false;
    }
    //
    f.AdaptLayout();
  }  
  //
  // Su Safari e Chrome c'e' un baco con la gestione delle scrollbar, che rimangono anche se il pannello ci sta completamente, 
  // allora qui le tolgo e poi sara' la SetScrollbar a rimetterle (l'AdaptFormListLayout non legge le dimensioni dal DOM quindi la modifica non ha impatto su di lei)
  // facendo cosi' Safari e Chrome calcolano bene le scrollbar, togliendole se non servono.. lo devo fare qui per un motivo di tempi inspiegabile,
  // se lo faccio dopo l'AdaptFormListLayout o dentro la setScrollbar non funziona..
  if (RD3_Glb.IsChrome() || RD3_Glb.IsSafari())
  {
    this.ContentBox.style.overflowX = "hidden";
    this.ContentBox.style.overflowY = "hidden";
  }
  //
  // Ridimensiono i contenitori del pannello in lista e in form
  this.AdaptFormListLayout();
  //
  // Rimetto le scrollbar dove devo
  this.SetScrollbar();
  //
  // Mostro/Nascondo bottone carica altre righe
  if (this.MoreAreaBox)
  {
    this.MoreAreaBox.style.display = (this.TotalRows>this.NumRows)?"":"none";
    if (this.IsMyScroll() && this.IDScroll)
      this.IDScroll.MarginBottom = (this.TotalRows>this.NumRows)?40:0;
    this.MoreButton.className = "panel-more-button";
  }
  //
  // ora rimetto la listbox dal dom...
  if (removeFromDOM)
  {
    if (restoreListInDom)
      this.ContentBox.appendChild(this.ListBox);
    //
    // Devo riposizionare la scrollbar. Questa operazione l'ha sicuramente azzerata!
    this.QbeScroll = true;
    //
    // Se nel rimuovere la listbox dal dom ho perso il fuoco, lo rimetto a posto!
    if (refoc)
    {
      if (refoc.tagName == "DIV" && refoc.getAttribute("contenteditable") != "true")
        RD3_KBManager.CheckFocus=true;
      else
        refoc.focus();
    }
  }
  //
  // Con queste righe di codice si fanno sparire
  // le scrollbar che IE tende a mettere quando si rimpiccilisce lo spazio
  // disponibile
  // Se lo faccio durante un animazione di form/list e per caso il pannello ha le scrollbar queste righe fanno vedere per un istante la lista..
  // Lo stesso succede durante un animazione di collassamento
  if (!this.AnimatingPanel && !this.Collapsing)
  {
    var oldScrollTop = this.ContentBox.scrollTop;
    this.ContentBox.scrollTop = oldScrollTop + 1000;
    this.ContentBox.scrollTop = oldScrollTop;
  }
  //
  // Comunico a IDScroll che portrebbe essere cambiata l'altezza... 
  // ma non mentre sposto da lista a form e viceversa e poi solo se e' MIO
  // se c'e' l'ha una combo che si sta spostando non va bene
  if (this.IsMyScroll() && this.PullAreaBox && this.PanelMode==RD3_Glb.PANEL_LIST)
  {
    this.IDScroll.PullTrigger = -this.PullAreaBox.offsetTop+this.PullAreaBox.offsetHeight/2;
    //
    // Nel caso quadro esiste un'area coperta piu' grande, ma deve funzionare come prima
    if (RD3_Glb.IsQuadro())
      this.IDScroll.PullTrigger -= 40;
  }
  else if (this.IDScroll)
    this.IDScroll.PullTrigger = 0;
  //
  if (this.IsMyScroll() && !this.AnimatingToolbar)
   this.IDScroll.ChangeSize();
  //
  this.RecalcLayout = false;
  this.SendResize = false;
}



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

			config.extraPlugins = ''; //per il correttore ortografico guarda sotto, (15/03/2013-tolto l'omissis)
			//config.extraPlugins = 'switchbar,omissis,giustifica';
			config.switchBarSimple = 'Basic';
			config.switchBarReach = 'Full';
			config.switchBarDefault = 'Basic';
			config.tagOmissis = 'strike';
			config.tagGiustifica = 'div';
			config.switchBarSimpleIcon = 'maximise.gif';
			config.switchBarReachIcon = 'minimise.gif';
			//config.forcePasteAsPlainText = true;
			config.resize_enabled = false;
			//config.pasteFromWordCleanupFile = 'cleanword';
			config.allowTagsForJasperReport = new Array("b", "u", "i", "sup", "sub", "li", "br", "ul", "ol", "s");
			
			//setto il correttore ortografico subito attivo, e sulla lingua italiana. TOLTO CORRETTORE
			//config.scayt_autoStartup = false;
			//config.scayt_sLang = 'it_IT';
			
	
		//Configurazioni Toolbar ..... tra parentesi quadre i pulsanti da ragruppare in una sezione, con '/' si va a capo e con '-' si lascia uno spazio
			

			// Configurazione personalizzata dei pulsanti presenti nella toolbar
			config.toolbar_Basic =
			[
				['Cut','Copy','Paste','PasteText', 'PasteFromWord'],//,'Scayt'], TOLTO CORRETTORE
				['Undo','Redo','-','Find','Replace','-','SelectAll','RemoveFormat'],
				['SpecialChar','Table'],
				//['Bold','Italic','Strike','Underline'],
				['Bold','Italic','Strike'],// (20/06/2013-tolto l'underline)
				//['Bold','Italic','Strike','Underline','Giustifica','Omissis'],
				//['JustifyLeft','JustifyCenter','JustifyRight','JustifyBlock'],
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


//DA EELIMINARE CON IL PASSAGGIO AD INDE 13.0
//PATCH per risolvere il problema del ckEditor dovuta alla cancellazione del campo e, spostando il focus, si ripresenta ciò che avevamo cancellato in precedenza.

//**************************************************
// NPQ01173 - ASS 000103-2014
/*
PValue.prototype.SendChanges = function(evento, flag)
{
  var srcobj = null;
  //
  // Non invio variazione campi BLOB
  if (this.ParentField.DataType==10)
    return;
  //
  if (evento.tagName) // Evento puo' contenere anche il srcobj, nel caso del calendario
  {
    srcobj = evento;
  }
  else
  {
    if (evento.getData)
    {
      // E' un FCK editor!!!
    }
    else
    {
      // Normale input box, etc...
      srcobj = (window.event)?evento.srcElement:evento.originalTarget;
    }
  }
  //
  // Se premo su uno span, e' lui l'oggetto attivo
  // in questo caso torno all'input
  if (srcobj && srcobj.tagName=="SPAN")
  {
  	var v = srcobj.previousSibling;
  	if (v && v.tagName=="INPUT")
  		srcobj = v;
  }
  //
  if (this.IsEnabled())
  {
    var s = (srcobj)?srcobj.value:"";
    if (s==undefined) s="";
    var chg = false;
    //
    // Se il valore coincide con la maschera non e' una vera modifica
    var cell = null;
    if (srcobj)
    {
      cell = RD3_KBManager.GetCell(srcobj);
      //
      // Su !IE arriva un change spurio se clicco su di una immagine, in questo caso se la cella ha un Watermark non faccio nulla
      // Su mobile arrivo qui anche se le celle hanno il watermark: devo comunque uscire
      if (cell && cell.HasWatermark && (!RD3_Glb.IsIE() || RD3_Glb.IsMobile()))
        return;
      //
      var en = cell.IsEnabled;
      var msk = cell.Mask;
      if (en && s.length>0 && msk  && msk!="" && srcobj.tagName=="INPUT")
      {
        // Provo a togliere la maschera e rileggo il valore
        // Mantengo se possibile il cursore nella stessa posizione
        var oldv = srcobj.value;
        var curpos = getCursorPos(srcobj);
        //
        umc(null);
        s = srcobj.value;
        //
        // Reimposto il valore corretto dell'input
        srcobj.value = oldv;
        //
        // Provo a riposizionare il cursore all'interno del campo
        // Lo faccio solo se non sto gestendo la perdita del fuoco di questa cella
        // dato che la setCursorPos riapplica il fuoco a questo campo!
        if (!RD3_KBManager.LoosingFocus)
          setCursorPos(srcobj, curpos!=-1 ? curpos : oldv.length);
      }
      //
      // Gestione IDCombo: prelevo il valore 
      if (cell && cell.ControlType==3)
        s = cell.IntCtrl.GetComboValue();
      if (cell && cell.ControlType==4 && RD3_Glb.IsMobile())
      {
      	if (srcobj.tagName=="SPAN")
      		srcobj = srcobj.parentNode;
        s = srcobj.checked?"on":"";
      }
    }
    //
    if (evento.getData)
    {
      s = evento.getData();
      evento = null;
      //
      //*******************************************************************************************
      // Se c'e' una cella attivata che contiene CKEDitor ed e' collegata al mio stessto campo la uso come cella su cui memorizzare le informazioni 
      // di dato acquisito
      var hcell = (this.ParentField.ParentPanel.PanelMode == RD3_Glb.PANEL_LIST && this.ParentField.PListCells ? this.ParentField.PListCells[0] : this.ParentField.PFormCell);
      if (hcell && hcell.ControlType == 101)
        cell = hcell;
      //********************************************************************************************
    }
    //
    // Creo un altra variabile per i dati da inviare al server, per gestire la discrepanza tra la gestione client e server dei check
    var send = s;
    //
    var sendev = true;
    //
    // Se il testo e' vuoto e lo avevo svuotato io, non mando al server l'evento
    if (cell && cell.PwdSvuotata && s=="")
    {
  		sendev = false;
  		s = this.Text;
    }
    //
    if (srcobj)
    {
      switch (srcobj.type)
      {
        case "checkbox":
        {
          var vl = this.GetValueList();
          //
          if (vl && vl.ItemList.length>=2)
            s = (srcobj.checked)?vl.ItemList[0].Value:vl.ItemList[1].Value;
          else
            s = (srcobj.checked)?"on":"";
          //
          send = (srcobj.checked)?"on":"";
          //
          // Se non ho una lista valori associata non mando l'evento al server: necessario perche' potrei avere campi edit con VS check,
          // se mando il valore al server va in errore..
          if (!vl)
            sendev = false;
        }
        break;
        
        case "radio":
        {
          var vl = this.GetValueList();
          //
          // Se non ho una lista valori associata non mando l'evento al server: necessario perche' potrei avere campi edit con VS check,
          // se mando il valore al server va in errore..
          if (vl)
            s = vl.GetOption(srcobj);
          else
            sendev = false;
          //
          send = s;
        }
        break;
      }
    }
    //
    chg = (s!=this.Text);
    this.Text = s;
    //
    if (cell)
      cell.Text = s;
    //
    // Se sono un campo LKE... invece di scrivere LKE1,LKE2,... scrivo la decodifica... 
    // che e' poi quello che tornera' indietro dal server
    if (chg && cell && cell.ControlType==3 && this.ParentField.LKE)
    {
      this.Text = cell.IntCtrl.GetComboName();
      if (cell)
      {
        cell.Text = s;
        cell.IntCtrl.OriginalText = s;
      }
      //
      // Se e' "-" (LKENULL) svuoto la cella
      if (this.Text == "-" && cell.IntCtrl.GetComboValue()=="LKENULL")
      {
        cell.IntCtrl.SetComboValue(this.Text);
      }
      // Se e' "(VAL)" (LKEPREC) tolgo le parentesi
      if (this.Text!="" && cell.IntCtrl.GetComboValue()=="LKEPREC")
      {
        this.Text = this.Text.substring(1, this.Text.length-1);
        cell.IntCtrl.SetComboValue(this.Text);
        //
        cell.Text = this.Text;
        cell.IntCtrl.OriginalText = this.Text;
      }
    }
    //
    if (chg && sendev)
    {
      // Invio l'evento.
      // Ritardo l'evento di 200 ms se sto premendo il mouse LEFT e il campo e' ATTIVO... magari ho cliccato
      // sulla toolbar del pannello e voglio aspettare un pochino per infilare anche l'evento di click nella
      // stessa richiesta
      // Lo faccio anche se il flag e' serverside e il campo e' superattivo
      // Lo faccio anche se il campo e' un LKE attivo
      var ev;
      var sup = (this.ParentField.SuperActive && (flag&RD3_Glb.EVENT_SERVERSIDE)!=0);
      var actlke = (this.ParentField.LKE && this.ParentField.ChangeEventDef==RD3_Glb.EVENT_ACTIVE);
      var imm = ((this.ParentField.ChangeEventDef|flag) & RD3_Glb.EVENT_IMMEDIATE);
      //
      // Se e' multi-selezionabile invio anche la selezione attuale
      if (cell && cell.IntCtrl && cell.IntCtrl.MultiSel && this.ParentField.LKE && send.substr(0,3) != "LKE")
      {
        var txt = cell.IntCtrl.GetComboFinalName(true);
        txt += (txt.length > 0 && send.length > 0 ? ";" : "");
        send = txt + send;
      }
      //
      if ((RD3_DDManager.LButtonDown && imm) || sup || actlke)
      {
        ev = new IDEvent("chg", this.Identifier, evento, this.ParentField.ChangeEventDef|flag, "", send, "", "", "", sup ? RD3_ClientParams.SuperActiveDelay : 200, (sup||actlke) ? true : false);
      }
      else
      {
        ev = new IDEvent("chg", this.Identifier, evento, this.ParentField.ChangeEventDef|flag, "", send);  
      }
    }
    else
    {
      // Non devo lanciare l'evento, ma se premo INVIO mando comunque tutti gli
      // eventi in sospeso al server
      if (flag == RD3_Glb.EVENT_IMMEDIATE)
        RD3_DesktopManager.SendEvents();
    }
  }
}
*/

PValue.prototype.SetFCK= function(ev, list)
{ 
  var nm = this.ParentField.Identifier+(list? ":lcke" : ":fcke");
  var fck = CKEDITOR.instances[nm];
  if (fck)
  {
    // Se CK e' sporco con un valore diverso da quello che mi arriva dal server non lo sovrascrivo..
    var setVal = true;
    //
    // Lo faccio solo se l'elemento e' quello attivo, altrimenti e' una perdita di tempo
    // **Non uso il checkdirty() perche' non sempre funziona correttamente**
    //***************************************************************************
    if (RD3_KBManager.ActiveElement == fck)
    {
      var hcell = list ? this.ParentField.PListCells[0] : this.ParentField.PFormCell;
      if (hcell && hcell.ControlType == 101)
        setVal = (fck.getData()!=hcell.Text ? false : true);
    }
    else
    {
      // se non sono l'elemento attivo cerco tra gli eventi che ancora non sono stati inviati
      var ev = RD3_DesktopManager.MessagePump.GetEvent(this, "chg");
    	setVal = (ev ? false : true);
    }
    //***************************************************************************
    // 
    if (setVal)
      fck.setData(this.Text);
  }
  this.ParentField.FCKTimerID=0;
}

/*
PField.prototype.OnFCKSelectionChange= function(fck)
{
  var nr = this.ParentPanel.ActualPosition + this.ParentPanel.ActualRow;
  //
  if (this.ParentPanel.IsGrouped())
    nr = this.ParentPanel.GetRowIndex(this.ParentPanel.ActualRow);
  //
  try
  {
    //*******************************************************************
    var ed = fck.editor ? fck.editor : fck;
    //
    var uncommitted = false;
    var hcell = (this.ParentPanel.PanelMode == RD3_Glb.PANEL_LIST && this.PListCells ? this.PListCells[0] : this.PFormCell);
    if (hcell && hcell.ControlType == 101)
        uncommitted = (hcell.Text != ed.getData());
    //
    if (ed && ed.checkDirty && ed.checkDirty() || uncommitted)
    {
      var s = ed.getData();
      //
      if (this.PValues[nr].Text != s && this.FCKTimerID==0)
      {
        this.OnChange(ed,this.ParentPanel.ActualRow);
      }  
      //
      ed.resetDirty();
    }
    //*******************************************************************
  }
  catch (ex)
  {}
}*/
// NPQ01173 - ASS 000103-2014
//**************************************************



// ********************************************************************************
// Lanciato quando il testo del FCK cambia // ASS 1198-2014
// ********************************************************************************
PField.prototype.OnFCKSelectionChange= function(fck)
{
  var nr = this.ParentPanel.ActualPosition + this.ParentPanel.ActualRow;
  //
  if (this.ParentPanel.IsGrouped())
    nr = this.ParentPanel.GetRowIndex(this.ParentPanel.ActualRow);
  //
  try
  {
    var ed = fck.editor ? fck.editor : fck;
    if (ed && ed.checkDirty && ed.checkDirty())
    {
      var s = ed.getData();
      //
      if (this.PValues[nr].Text != s && this.FCKTimerID==0)
      {
        this.OnChange(ed,this.ParentPanel.ActualRow);
      }  
      //
      ed.resetDirty();
    }
  }
  catch (ex)
  {}
}



/* 
  ***************************************************************************************************************
  PARTE RELATIVA ALL'ASSISTENZA SUL NUOVO CKEDITOR NELLA VERSIONE 4.4.4
  SERVE A RISOLVERE IL PROBLEMA DELLA CHIUSURA DELLA POPUP CONTENENTE IL CKEDITOR NELL'ULTIMA VERSIONE APPUNTO. 
  IL BROBLEMA CHE SI VERIFICAVA ERA CHE ALLA CHIUSURA DELLA POPUP, L'ISTANZA DEL CKEDITOR VENIVA SPOSTATA IN ALTO
  A SINISTRA MA RIMANEVA COMUNQUE VISIBILE IN INTERFACCIA.
  ****************************************************************************************************************
*/

PCell.prototype.Unrealize = function()
{
  // Rimuovo i controlli dal DOM
  if (this.IntCtrl)
  {
    if (this.ControlType != 3)   // COMBO
    {
      if (this.ControlType == 101)
      {
        if (RD3_ServerParams.UseIDEditor)
        {
          this.IntCtrl.Unrealize();   // IDEditor
        }
        else
        {
          var nm = this.ParentField.Identifier + (this.InList ? ":lcke" : ":fcke");
          var ed = CKEDITOR.instances[nm];
          //
          if (ed)
          {
      
      
            document.body.appendChild(this.IntCtrl);
      // CON QUESTRO TRY CATCH INTERCETTIAMO L'ECCEZIONE E COSI CI TOGLIE L'ISTANZA DEL CKEDITOR E NON LA MOSTRA PIU IN ALTO A SX
      try
      {
              ed.destroy(true);
      }
      catch (ex)
      {
      }
          }
        }
      }
      //
      if (this.IntCtrl.parentNode)
        this.IntCtrl.parentNode.removeChild(this.IntCtrl);
      //
      if (this.ActObj && this.ActObj.parentNode)
        this.ActObj.parentNode.removeChild(this.ActObj);
      this.ActObj = null;
      //
      if (this.ErrorBox && this.ErrorBox.parentNode)
        this.ErrorBox.parentNode.removeChild(this.ErrorBox);
      this.ErrorBox = null;
      //
      if (this.OptionValueList)
        this.OptionValueList = null;
      //
      if (this.BadgeObj != null && this.BadgeObj.parentNode)
        this.BadgeObj.parentNode.removeChild(this.BadgeObj);
      this.BadgeObj = null;
      //
      if (this.TooltipDiv && this.TooltipDiv.parentNode)
        this.TooltipDiv.parentNode.removeChild(this.TooltipDiv);
      this.TooltipDiv = null;
    }
    else
      this.IntCtrl.Unrealize();   // IDCombo
    //
    if (RD3_KBManager.ActiveElement && RD3_KBManager.ActiveElement == this.IntCtrl)
      RD3_KBManager.ActiveElement = null;
    //
    // E mi dimentico di lui
    this.IntCtrl = null;
  }
  //
  // Mi stacco dai miei "padri"
  this.PValue = null;
  this.ParentField = null;
  //
  // Se ero selezionato... ora non lo sono piu'
  if (RD3_DesktopManager.WebEntryPoint.HilightedCell==this)
    RD3_DesktopManager.WebEntryPoint.HilightedCell = null;
}


/********************************************************************
*PARTE DI LORENZ (per poter cancellare i pallini dal campo password)*
*********************************************************************/
// **********************************************************************
// Mette/toglie l'evidenziazione sulla cella
// **********************************************************************
PCell.prototype.SetActive = function()
{
  // Un header di gruppo non e' mai fuocabile
  if (this.ControlType == 111)
    return;
  //
  // Vediamo chi era gia' attivato
  var oldCell = RD3_DesktopManager.WebEntryPoint.HilightedCell;
  //
  // La cella gia' attiva sono io... non faccio null'altro
  if (oldCell==this)
  {
    // Se, pero', sono una combo deferrata, allora lo comunico ugualmente
    if (this.ControlType==3 && this.IntCtrl.DeferEmpty)
      this.IntCtrl.SetText("", true, true);
    return;
  }
  //
  // Se c'era gia' una cella attiva, la disattivo
  if (oldCell)
    oldCell.SetInactive();
  //
  // Se la cella e' abilitata e' fuocabile
  if (this.IsEnabled && this.ControlType != 6 && !RD3_Glb.IsMobile())
  {
    // Ora proseguo con me. Recupero i dati di questa cella
    var pf = this.ParentField;
    var vs = this.PValue ? this.PValue.GetVisualStyle() : pf.VisualStyle;
    //
    var backCol  = vs.GetColor(10); // VISCLR_EDITING
    var brdColor = vs.GetColor(11); // VISCLR_BORDERS
    var bt = vs.GetBorders((this.InList)? 1 : 6); // VISBDI_VALUE : VISBDI_VALFORM
    var r = vs.GetBookOffset(true,(this.InList)? 1 : 6); // r contiene le dimensioni di ogni bordo
    // r.x = bordo sinistro
    // r.y = bordo sopra
    // r.w = bordo destro
    // r.h = bordo sotto
    //
    // Evidenzio il mio bordo
    var s = this.GetDOMObj().style;
    if (backCol != "transparent")
      s.backgroundColor = backCol;
    else
    {
      // Imposto i bordi solo se non c'e' il colore di editing
      s.border = "2px solid " + brdColor;
      var neww = parseInt(s.width)-(4-r.x-r.w);
      var newh = parseInt(s.height)-(4-r.y-r.h);
      s.width = (neww<0 ? 0 : neww) + "px";
      s.height = (newh<0 ? 0 : newh) + "px";
    }
    //
    // Se c'e' l'attivatore ed e' visibile, evidenzio anche lui!
    if (this.ActObj && this.ActObjVisible)
    {
      var ss = this.ActObj.style;
      if (backCol != "transparent")
        ss.backgroundColor = backCol;
      else
      {
        if (this.ActPos==1)
        {
          ss.borderLeft = "2px solid " + brdColor;
          s.borderLeft = "none";
          //
          // Lascio fermo l'attivatore!
          ss.backgroundPosition = "1px center";
          //
          // Ripristino larghezza del campo che e' stata mangiata dalla sparizione del bordo
          s.width = (parseInt(s.width)+2) + "px";
        }
        else
        {
          ss.borderRight = "2px solid " + brdColor;
          s.borderRight = "none";
          //
          // Devo anche spostarlo in "dentro" di un po'
          var dd = 3 - 2*r.w;
          ss.left = (parseInt(ss.left) - dd) + "px";
          //
          // Lascio fermo l'attivatore!
          ss.backgroundPosition = "3px center";
        }
        ss.borderTop = "2px solid " + brdColor;
        ss.borderBottom = "2px solid " + brdColor;
        //
        // Purtroppo sembra che senza bordi l'attivatore sia anche piu' corto...
        var dh = (r.y==0 && r.h==0)?3:4;
        ss.height = (parseInt(ss.height)-(dh-r.y-r.h)) + "px";
      }
    }
    //
    // Se e' una COMBO la informo che e' diventata attiva
    if (this.ControlType==3 || (this.ControlType == 101 && RD3_ServerParams.UseIDEditor))
      this.IntCtrl.SetActive(true);
    //
    // Ora questa e' la cella attiva
    RD3_DesktopManager.WebEntryPoint.HilightedCell = this;
    //
    // Se e' un campo password, lo svuoto... non gestiamo il delta!
    // lo faccio solo se conteneva solo degli asterischi
    /*if (this.ControlType==2 && this.NumRows==1)
    {
      var vs = this.PValue.GetVisualStyle();
      if (vs.IsPassword())
      {
        var svuota = true;
        for (var idx = 0; idx<this.Text.length; idx++)
        {
          if (this.Text.substr(idx,1)!="*")
          {
            svuota=false;
            break;
          }
        }
        //
        if (svuota)
        {
          this.IntCtrl.value = "";
          this.PwdSvuotata = true;
        }
      }
    }*/
    //
    // Se ho un tooltip di errore e il parametro e' 2 mostro tooltip
    if (this.TooltipErrorObj && !this.TooltipErrorObj.Opened && RD3_ServerParams.TooltipErrorMode == 2)
      this.TooltipErrorObj.Activate();
  }
  else
  {
    // Non posso fuocarla... dichiaro la perdita del fuoco
    this.ParentField.LostFocus(this.IntCtrl,null, true);
  }
}

//questo mi serve per limitare il numero di caratteri dell'oggetto a 1024
function setMaxLengthToOggettoDiv(){
	
		var elementsArray = document.getElementsByClassName("oggetto-div");
		var currentElement;
		for(var i = 0; i< elementsArray.length; i++){
			currentElement = elementsArray[i];
			if(currentElement.tagName.toLowerCase() === "textarea")
				currentElement.setAttribute("maxLength", 1024);
		}	
}

/*******
funzione per impostare autocomplete = off su un tag
nb: da qui in poi va riportatu tutto anche sulle custom degli altri progetti
*******/
GlobalObject.prototype.AutocompleteOff = function (node) 
{
  if (this.AutocompleteTimer) 
  {
    clearTimeout(this.AutocompleteTimer);
    delete this.AutocompleteTimer;
  }
  //
  if (!this.InputList)
    this.InputList = [];
  this.InputList.push(node);
  //
  this.AutocompleteTimer = setTimeout(function () {
    for (var i = 0; i < RD3_Glb.InputList.length; i++) {
      var curInput = RD3_Glb.InputList[i];
      //
      // Attualmente off e' la scelta corretta, nel caso chrome cambi gestione e' possibile invertire le righe per ottenere un valore univoco
      var value = "off";
      //let value = Math.ceil(Math.random()*10000)+"-"+Math.floor(Math.random()*10000);
      if (curInput.getAttribute("type") === "password")
        value = "new-password";
      //
      curInput.setAttribute("autocomplete", value);
    }
    delete RD3_Glb.InputList;
    delete RD3_Glb.AutocompleteTimer;
  }, 350);
};

IDCombo.prototype.Realize = function(container, cls) 
{
  // Se non mi hanno ancora assegnato un identificativo, lo creo e mi inserisco nella mappa
  if (this.Identifier == "")
  {
    this.Identifier = "cmb:" + Math.floor(Math.random() * 1000000000);
    RD3_DesktopManager.ObjectMap.add(this.Identifier, this);
  }
  //
  // L'input c'e' sempre!
  if (!this.ComboInput)
  {
    if (RD3_Glb.IsMobile())
    {
      this.ComboInput = document.createElement("div");
      this.ComboInput.value = this.ComboInput.textContent;
    }
    else
    {
      this.ComboInput = document.createElement("input");
      this.ComboInput.type = "text";
	  // ******************************************
	  RD3_Glb.AutocompleteOff(this.ComboInput);
	  // ******************************************
    }
    this.ComboInput.className = "combo-input";
    this.ComboInput.setAttribute("id", this.Identifier);
    if (this.Owner.SetZIndex)
      this.Owner.SetZIndex(this.ComboInput);
  }
  container.appendChild(this.ComboInput);
  //
  // Attacco gli eventi
  var parentContext = this;
  this.ComboInput.onkeydown = function(ev) { parentContext.OnKeyDown(ev); };
  //
  // Se non e' IE attacco gli eventi di focus
  if (!RD3_Glb.IsIE(10, false))
  {
    this.ComboInput.onfocus = function(ev) { RD3_KBManager.IDRO_GetFocus(ev); };
    this.ComboInput.onblur = function(ev) { RD3_KBManager.IDRO_LostFocus(ev); };
    //
    // In firefox l'evento di doppio click non arriva al body
    if (RD3_Glb.IsFirefox(3))
      this.ComboInput.ondblclick = function(ev) { RD3_KBManager.IDRO_DoubleClick(ev); };
  }
  //
  // Se e' stata fornita una classe particolare, la aggiungo
  if (cls)
    RD3_Glb.AddClass(this.ComboInput, cls);
  //
  // Se deve essere mostrato l'attivatore, lo creo
  if (this.ShowActivator)
  {
    if (!this.ComboActivator)
    {
      this.ComboActivator = document.createElement("DIV");
      this.ComboActivator.className = "combo-activator";
      this.ComboActivator.style.width = (this.ActWidth + 3) + "px";
      if (this.Owner.SetZIndex)
        this.Owner.SetZIndex(this.ComboActivator);
      //
      // E' nato l'attivatore... meglio riapplicare il VS appena posso... magari mi
      // hanno clonato da una combo che non aveva il vs
      this.VisualStyle = null;
    }
    container.appendChild(this.ComboActivator);
    //
    // Attacco l'evento (in Mobile non serve attaccare all'attivatore l'evento perche' e' l'intera combo che e' cliccabile/toccabile)
    if (!RD3_Glb.IsMobile())
      this.ComboActivator.onclick = function(ev) { parentContext.OnClickActivator(ev); };
  }
  //
  // Se ho l'immagine, aggiungo anche lei al container
  if (this.ComboImg)
    container.appendChild(this.ComboImg);
  if (this.ComboBadge)
    container.appendChild(this.ComboBadge);
  //
  // Se sono su mobile, adatto l'input
  if (RD3_Glb.IsMobile())
    this.AdaptMobileInput();
}



IDCombo.prototype.Open = function(update)
{
  // Se sono smartlookup Mobile devo sempre aprirmi con l'intera lista
  var askList = false;
  if (RD3_Glb.IsMobile() && !this.ListOwner && this.Owner.Text != "*" && this.ComboPopup && this.ComboPopup.style.display=="none")
  {
    askList = true;
    if (this.ComboPopupInput)
    {
      this.ComboPopupInput.value = "";
      RD3_Glb.RemoveClass(this.ComboPopupInput, "combo-search-deletable");
    }
  }
  //
  // Se non ho la lista
  if (!this.OptionList || askList)
  {
    // Se c'e' l'attivatore, clicco su di lui in modalita' FORCEOPEN... cosi' mi arriva la lista
    if (this.Owner.OnComboActivatorClick)
    {
      this.Owner.OnComboActivatorClick(true);
      //
      // Mi ricordo che ho cliccato sull'attivatore. Quando e se il server
      // mi rispondera', ne tengo conto
      this.ActClicked = true;
    }
    //
    return;
  }
  //
  // Se non ho ancora l'oggetto nel DOM, lo creo
  var tbody = null;
  var parentContext = this;
  if (!this.ComboPopup)
  {
    this.ComboPopup = document.createElement("DIV");
    this.ComboPopup.className = "combo-popup";
    this.ComboPopup.setAttribute("id", this.Identifier+":cap");
    if (RD3_Glb.IsTouch() && !RD3_Glb.IsMobile() && !RD3_Glb.IsIE(10, true))
    {
      this.ComboPopup.addEventListener("touchstart", function(ev) { parentContext.OnTouchStart(ev); }, false);
      this.ComboPopup.addEventListener("touchmove",  function(ev) { parentContext.OnTouchMove(ev); }, false);
      this.ComboPopup.addEventListener("touchend",   function(ev) { parentContext.OnTouchEnd(ev); }, false);
    }
    //
    // Se il menu e' TaskBar la combo deve avere z-index 10, in modo da potersi vedere anche sopra alle form modali..
    if (!RD3_Glb.IsMobile() && RD3_DesktopManager.WebEntryPoint.MenuType==RD3_Glb.MENUTYPE_TASKBAR)
      this.ComboPopup.style.zIndex = 10;
    //
    var tbl = document.createElement("TABLE");
    tbl.className = "combo-popup-table";
    tbody = document.createElement("TBODY");
    tbl.appendChild(tbody);
    this.ComboPopup.appendChild(tbl);
    this.ComboTbl = tbl;
    //
    if (RD3_Glb.IsMobile())
    {
      var parp = (this.Owner instanceof PCell || this.Owner instanceof IDEditor) ? this.Owner.ParentField.ParentPanel : null;
      if (this.IsPopOver())
      {
        document.body.appendChild(this.ComboPopup);
      }
      else if (this.SlideForm())
      {
        if (!this.CloneElem)
        {
          this.CloneElem = parp.WebForm.FramesBox.cloneNode(false);
          parp.WebForm.FormBox.appendChild(this.CloneElem);
        }
        this.CloneElem.appendChild(this.ComboPopup);
      }
      else
      {
        // Lo appendo al content box, fratello di form box e list box
        parp.ContentBox.appendChild(this.ComboPopup);
      }
    }
  }
  else
  {
    // L'ho gia'... lo rendo visibile se l'ho nascosto
    this.ComboPopup.style.display = "";
    if (this.CloneElem)
      this.CloneElem.style.display = "";
    //
    // E recupero il body a cui aggiungero' i TR
    var obj = this.ComboPopup.firstChild;
    while (obj && obj.tagName!="TABLE")
      obj = obj.nextSibling;
    //
    if (!obj && this.ComboTbl)
      obj = this.ComboTbl;
    //
    if (obj)
      tbody = obj.tBodies[0];
  }
  //
  // Proseguo solo se ho trovato i miei oggetti
  if (!tbody)
    return;
  //
  // Se la lista non e' in fondo al DOM / caso mobile gestito sopra
  if (!RD3_Glb.IsMobile())
  {
    if (this.ComboPopup.parentNode != document.body || this.ComboPopup.nextSibling)
      document.body.appendChild(this.ComboPopup);
  }
  //
  // Nascondo temporaneamente il popup, lo mostro dopo aver fatto tutti i calcoli di posizionamento
  this.ComboPopup.style.visibility = "hidden";
  //
  // Se il mio owner e' un PCell che ha delle proprieta' dinamiche devo applicarle al VS
  if (this.Owner && this.Owner instanceof PCell && this.Owner.GetDynPropSign()!="|||-1|")
    this.Owner.ApplyDynPropToVisualStyle(this.VisualStyle);
  //
  // Applico lo stile al popup
  var backcol = this.VisualStyle.GetColor(4);
  if (backcol=="transparent")
    this.VisualStyle.SetColor("white", 4);
  var brd = this.VisualStyle.GetBorders(6);
  if (brd!=4)
    this.VisualStyle.SetBorderType(4, 6);
  // 
  this.VisualStyle.ApplyValueStyle(this.ComboPopup, false, false, false, false, false, false, false, null, false, false, false, true);
  //
  if (backcol=="transparent")
    this.VisualStyle.SetColor("transparent", 4);
  if (brd!=4)
    this.VisualStyle.SetBorderType(brd, 6);
  //
  // Se sono in apertura (no update), rendo tutti gli item visibili
  if (!update)
  {
    this.OptionList.SetComboItemsVisible();
    //
    // Scelgo l'item da evidenziare
    if (this.SelItems.length > 0)
      this.HLItem = this.SelItems[0];
    else
      this.HLItem = this.OptionList.GetNextVisibleItem();
  }
  //
  // Popolo il popup con gli option
  this.OptionList.RealizeCombo(tbody, this.Identifier, this.VisualStyle, this.SelItems, this.MultiSel, this.HLItem, this.OptionList && !this.ListOwner);
  //
  var n = this.OptionList.ItemList.length;
  for (var i=0;i<n;i++)
  {
    var optlist = this.OptionList.ItemList[i];
    if (optlist.Image != "")
    {
      // Se devo retinare, nascondo l'immagine (cosi non si vede grande) e quando arriva la rimostro
      if (RD3_Glb.Adapt4Retina(this.Identifier, optlist.Image, 43, i))
      {
        // Nel caso debba retinare, nascondo per un attimo le immagini grandi 
        // per poi mostrarle quando saranno ridimensionate
        var it = optlist.TR;
        if (it && it.childNodes.length >= 1)
        {
          var itImg = it.childNodes[1].firstChild;
          if (itImg)
            itImg.style.display = "none";
        }
      }
    }
  }
  //
  // Se la combo mostra il valore, creo un input fittizio tramite il quale posso fare
  // l'editing con autocomplete
  if (!update && (this.ShowValue || RD3_Glb.IsMobile()))
  {
    // Se non l'ho ancora creato, lo faccio ora
    if (!this.ComboPopupInput)
    {
      this.ComboPopupInput = document.createElement("INPUT");
	  //***********************************************
	  RD3_Glb.AutocompleteOff(this.ComboPopupInput);
	  //***********************************************
      if (RD3_Glb.IsMobile())
      {
        this.ComboPopupInput.className = "combo-search";
        this.ComboPopupInput.setAttribute("id", this.Identifier+":txt");
        this.ComboPopupInput.placeholder = ClientMessages.MOB_SEARCH_HINT;
        //
        if (this.IsPopOver() && !this.ListOwner)
        {
          this.ComboSearchArea = document.createElement("DIV");
          this.ComboSearchArea.className = "combo-search-area";
          this.ComboSearchArea.appendChild(this.ComboPopupInput);
          this.ComboPopup.insertBefore(this.ComboSearchArea, this.ComboPopup.firstChild);
        }
        else
          this.ComboPopup.insertBefore(this.ComboPopupInput, this.ComboPopup.firstChild);
      }
      else
      {
        this.ComboPopupInput.className = "combo-input";
        this.ComboPopupInput.style.height = (this.Height - (RD3_ServerParams.Theme == "zen" ? (this.Owner.InList ? -6 : 3) : 5)) + "px";                  // Alto come l'input
        document.body.appendChild(this.ComboPopupInput);
        //
        // Applico lo stile all'input fittizio
        this.VisualStyle.ApplyValueStyle(this.ComboPopupInput);
        //
        // Il bordo e' 2px come se fosse una cella attiva
        this.ComboPopupInput.style.borderWidth = "2px";
      }
      //
      // Attacco gli eventi da usare per la multi-selezione
      this.ComboPopupInput.onkeyup = function(ev) { parentContext.OnKeyUp(ev); };
      //
      if (RD3_Glb.IsAndroid())
      {
        var md = function(ev) { parentContext.OnSearchMouseDown(ev); };
        if (RD3_Glb.IsTouch() && !RD3_Glb.IsIE(10, true))
          this.ComboPopupInput.addEventListener("touchstart", md, false);
        else if (document.addEventListener)
          this.ComboPopupInput.addEventListener("mousedown", md, false);
        else
          this.ComboPopupInput.attachEvent("onmousedown", md);
      }
      //
      // Su iOS7 non si rimette a posto lo scroll quando la tastiera e' chiusa
      if (RD3_Glb.IsMobile() && (RD3_Glb.IsIphone(7) || RD3_Glb.IsIpad(7)))
        this.ComboPopupInput.onblur = function(ev) { document.body.scrollTop = 0; };
    }
    else
    {
      // Lo mostro e copio il valore corrente
      this.ComboPopupInput.style.display = "";
      //
      if (this.ComboSearchArea)
        this.ComboSearchArea.style.display = "";
      //
      // Se la combo non era aperta, svuoto il valore. Non lo faccio se e' un auto-lookup
      if (!this.IsOpen && this.ListOwner)
        this.ComboPopupInput.value = "";
    }
    //
    if (!RD3_Glb.IsMobile())
    {
      // Aggiorno il contenuto dell'input fittizio
      this.ComboPopupInput.value = this.GetComboFinalName(false);
      //
      // Memorizzo il testo originale presente nell'input (per gestire bene il KeyUp)
      this.PreviousInputText = this.ComboPopupInput.value;
    }
    else
    {
       if (!RD3_Glb.IsTouch() && this.Writable)
        window.setTimeout("document.getElementById('"+this.ComboPopupInput.id+"').focus()",500);
    }
  }
  //
  // Se il mio owner e' un PCell che ha delle proprieta' dinamiche devo ripulire il VS
  if (this.Owner && this.Owner instanceof PCell && this.Owner.GetDynPropSign()!="|||-1|")
    this.Owner.CleanVisualStyle(this.VisualStyle);
  //
  // Posiziono il popup con ridimensionamento
  if (!this.AnimatingCombo && !RD3_Glb.IsMobile())
    this.AdaptPopupLayout(true);
  //
  // Mi assicuro che l'item selezionato sia visibile
  this.EnsureItemVisible();
  //
  // Se l'input fake e' visibile
  if (this.ComboPopupInput && this.ComboPopupInput.style.display=="" && !RD3_Glb.IsMobile())
  {
    // Lo fuoco
    if (this.Writable)
      this.ComboPopupInput.focus();
    //
    // Alla fine dell'apertura della combo su !IE il fuoco viene ridato all'activeElement, che pero' e' l'input nascosto.. per correggere il problema sostituiamo
    // l'activeElement con quello corretto
    if (!RD3_Glb.IsIE(10, false))
      RD3_KBManager.ActiveElement = this.ComboPopupInput;
    //
    // Se ho appena aperto, seleziono tutto il testo
    if (!update)
      this.SelectAllDummyInpText();
  }
  //
  // Segnalo la combo aperta (usata poi anche dal pannello per aggiornare la toolbar)
  RD3_DDManager.OpenCombo = this;
  //
  // Ora se la combo non e' gia' aperta la faccio aprire con l'animazione
  if (!this.IsOpen)
  {
    if (RD3_Glb.IsMobile())
    {
      if (this.IsPopOver())
      {
        this.ComboPopup.style.visibility = "";
        this.ShowPopOverCombo(true);
      }
      else
      {
        this.ShowMobileCombo(true);
      }
    }
    else
    {
      this.ComboPopup.style.visibility = "";
      var fx = new GFX("combo", true, this, RD3_Glb.IsFirefox(3));
      RD3_GFXManager.AddEffect(fx);
    }
  }
  else
  {
    this.ComboPopup.style.visibility = "";
  }
  //
  // Questa e' la combo aperta
  this.IsOpen = true;
}


IDCombo.prototype.Clone = function(owner)
{
  // Creo la nuova istanza
  var NewCombo = new IDCombo(owner);
  //
  // La battezzo e la inserisco nella mappa
  NewCombo.Identifier = "cmb:" + Math.floor(Math.random() * 1000000000);
  RD3_DesktopManager.ObjectMap.add(NewCombo.Identifier, NewCombo);
  //
  // Copio le proprieta'
  NewCombo.Left = this.Left;
  NewCombo.Top = this.Top;
  NewCombo.Width = this.Width;
  NewCombo.Height = this.Height;
  NewCombo.Enabled = this.Enabled;
  NewCombo.Visible = this.Visible;
  NewCombo.RightAlign = this.RightAlign;
  NewCombo.Clickable = this.Clickable;
  NewCombo.Tooltip = this.Tooltip;
  //
  NewCombo.ListOwner = this.ListOwner;
  NewCombo.ShowActivator = this.ShowActivator;
  NewCombo.IsOptional = this.IsOptional;
  NewCombo.AllowFreeText = this.AllowFreeText;
  NewCombo.ShowValue = this.ShowValue;
  NewCombo.ActImage = this.ActImage;
  NewCombo.ActWidth = this.ActWidth;
  NewCombo.ActEnaIfComboDis = this.ActEnaIfComboDis;
  NewCombo.VisualStyle = this.VisualStyle;
  NewCombo.OptionList = null;
  NewCombo.SelItem = null;
  NewCombo.PreviousInputText = this.PreviousInputText;
  NewCombo.OriginalText = this.OriginalText;
  NewCombo.MultiSel = this.MultiSel;
  NewCombo.HasWatermark = this.HasWatermark;
  NewCombo.UsePopover = this.UsePopover;
  NewCombo.Badge = this.Badge;
  NewCombo.ClassName = this.ClassName;
  //
  // E lo stato dei padding (per mobile)
  NewCombo.PaddingLeft = this.PaddingLeft;
  NewCombo.PaddingRight = this.PaddingRight;
  //
  // Clono l'input
  NewCombo.ComboInput = this.ComboInput.cloneNode(false);
  if (RD3_Glb.IsMobile())
    NewCombo.ComboInput.value = this.ComboInput.value;

   //**************************************************
  // Aggiorno il valore di autocomplete, in modo da tenerlo spento
  RD3_Glb.AutocompleteOff(NewCombo.ComboInput);
  //**************************************************
  
  //
  // Se c'e' l'attivatore clono anche lui
  if (this.ComboActivator)
    NewCombo.ComboActivator = this.ComboActivator.cloneNode(false);
  //
  // Se c'e' l'immagine (ed e' visibile) clono anche lei
  if (this.ComboImg)
    NewCombo.ComboImg = this.ComboImg.cloneNode(false);
  //
  // Se c'e' il Badge clono anche lui
  if (this.ComboBadge)
    NewCombo.ComboBadge = this.ComboBadge.cloneNode(true);
  //
  // Fatto
  return NewCombo;
}

