CKEDITOR.plugins.add('custompaste', {
    init: function (editor) {
        CKEDITOR.on('instanceReady', function (ev) {
            ev.editor.on('paste', function (e) {
                customCleanWord = function (h, li) {
                    var _h = h;
                    this.removeDecorator = function (tag) {
                        _h = _h.replace(new RegExp("<" + tag + "[^>]*>", "gi"), "");
                        _h = _h.replace(new RegExp("<\/" + tag + ">", "gi"), "");
                    }
					this.removeChild = function (parent, child) {
                        _h = _h.replace(new RegExp("<" + parent + "[^>]*>" + "*" + "<" + child + "[^>]*>", "gi"), "<" + parent + ">");
                    }
                    this.removeEmptyElement = function (tag) {
                        _h = _h.replace(new RegExp("<" + tag + "([^>])*>(&nbsp;)*\s*<\/" + tag + ">", "gi"), "");
                    }
                    this.removeAttributeEverywhere = function (attr) {
                        _h = _h.replace(new RegExp("<([a-zA-Z]+) ([^>]*)" + attr + "=\"[^\"]+\"([^>]*)>", "gi"), "<$1 $2 $3>");
                    }
                    this.removeTagAttributes = function (tag) {
                        _h = _h.replace(new RegExp("<(" + tag + ") [^>]*>", "gi"), "<$1>");
                    }
                    this.removeElementByPrefix = function (pref) {
                        _h = _h.replace(new RegExp("<" + pref + "\:([^>])*>([^<])*<\/" + pref + "\:([^>])*>", "gi"), "");
                        _h = _h.replace(new RegExp("<\\/?" + pref + "\:([^>])*>", "gi"), "");
                    }
                    this.removeElement = function (tag) {
                        _h = _h.replace(new RegExp("<" + tag + "([^>])*>([^<])*<\/" + tag + ">", "gi"), "");
                    }
                    this.removeSelfClosedElement = function (tag) {
                        _h = _h.replace(new RegExp("<" + tag + "([^>])*>", "gi"), "");
                    }
                    this.removeCharRepeats = function (char, subst) {
                        _h = _h.replace(new RegExp(char + "+", "gi"), subst);
                    }
                    this.removeComments = function () {
                        _h = _h.replace(new RegExp("<![-|\[][^>]*>", "gi"), "");
                    }
                    this.removeLocalCalls = function (tag, attr) {
                        _h = _h.replace(new RegExp("<" + tag + "\\s+[^>]*" + attr + "=\"file\:[^>]+>", "gi"), "");
                    }
                    // questa funzione ritorna true se un determinato valore è presente nell'array
                    var contains = function (arr, value) {
                            var i = arr.length;
                            while (i--) {
                                if (arr[i] === value) return true;
                            }
                            return false;
                        }
                    //parser html
                    var parser = new CKEDITOR.htmlParser();

                    //array dei tag ammessi inseriti nel file di configurazine custom3.js
                    var allowTags = editor.config.allowTagsForJasperReport

                    //il parser analizza ogni tag, se il tag non è fra quelli ammessi, viene eliminato
                    parser.onTagOpen = function (tagName, attributes, selfClosing) {
                            if (!(contains(allowTags, tagName))) {
                                removeDecorator(tagName);
                            };
                        };
                    //parsing della clipboard
                    parser.parse(h);

                    this.removeElementByPrefix("[a-zA-Z]{1,3}");
                    if (li == true) {
                        this.removeDecorator('ul');
                        this.removeDecorator('ol');
                    }
                    this.removeEmptyElement('p');
                    this.removeAttributeEverywhere('class');
                    this.removeAttributeEverywhere('style');
                    this.removeTagAttributes('div');
                    this.removeTagAttributes('p');
                    this.removeComments();
                    this.removeLocalCalls('img', 'src');
                    this.removeLocalCalls('link', 'href');
                    this.removeSelfClosedElement("\\?xml");
                    this.removeSelfClosedElement("meta");
                    this.removeElement('xml');
                    this.removeElement('style');
                    this.removeCharRepeats(" ", " ");
                    this.removeCharRepeats("\\n\\s", "\n");
					this.removeChild('li','br');
                    return _h;
                };
                if (editor.getSelection()) {
                    // se il paste lo inserisco in un elenco, elimino i tag ul e ol
                    var ancestor = editor.getSelection().getCommonAncestor();
                    if (ancestor.getName() == "li") {
                        e.data.html = customCleanWord(e.data.html, true);
                    } else {
                        // anche se il paste lo inserisco in un tag il cui padre è un elenco, elimino i tag ul e ol
                        var parent = ancestor.getParent();
                        if (parent.getName() == "li") {
                            e.data.html = customCleanWord(e.data.html, true);
                        } else {
                            e.data.html = customCleanWord(e.data.html, false);
                        }
                    }
                }
            });
        });
    }
});