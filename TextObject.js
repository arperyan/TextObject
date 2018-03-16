define( ["qlik", "jquery", "css!./style.css"],
function ( qlik, $, cssContent) {
  'use strict';
  $( "<style>" ).html( cssContent ).appendTo( "head" );

  return {
    definition: {
      type: "items",
      component: "accordion",
      items: {
        settings: {
          uses: "settings",
          type: "items",
          items: {
            AnyText: {
              ref: "text",
              label: "Text",
              type: "string",
              expression: "optional",
              defaultValue: "This is a sample text"
            },
            Font: {
              ref: "font",
              label: "Font",
              type: "items",
              items: {
                fontColorPicker: {
                  type: "object",
                  label: "Font colour",
                  component: "color-picker",
                  dualOutput: true,
                  ref: "fontcolor",
                  defaultValue: "#595959"
              },
              fontsize: {
                  ref: "fontsize",
                  label: "Size",
                  type: "integer",
                  defaultValue: 33
                },
                fontstyle: {
                  ref: "fontstyle",
                  label: "Font style",
                  type: "string",
                  component: "dropdown",
                  options: [{
                    value: "standard",
                    label: "Standard"
                  }, {
                    value: "bold",
                    label: "Bold"
                  }, {
                    value: "italic",
                    label: "Italic"
                  }, {
                    value: "italicbold",
                    label: "Italic Bold"
                  }],
                  defaultValue: "standard"
                },
                fontfamily: {
                  label: "Font Family",
                  type: "string",
                  ref: "fontfamily",
                  component: "dropdown",
                  options: [{
                    value: '"QlikView Sans", sans-serif',
                    label: '"QlikView Sans", sans-serif'
                  }, {
                    value: "LUI icons",
                    label: "LUI Icons"
                  }, {
                    value: "Georgia",
                    label: "Georgia"
                  }, {
                    value: "Times New Roman",
                    label: "Times New Roman"
                  }, {
                    value: "Arial",
                    label: "Arial"
                  }, {
                    value: "Comic Sans MS",
                    label: "Comic Sans MS"
                  }]
                },
              }
            },
            Layout: {
              ref: "layout",
              label: "Layout",
              type: "items",
              items: {
                horizontalalignment: {
                  label: "Horizontal Alignment",
                  ref: "horizontalalignment",
                  component: "dropdown",
                  options: [{
                    value: "left",
                    label: "Left"
                  }, {
                    value: "center",
                    label: "Center"
                  }, {
                    value: "right",
                    label: "Right"
                  }],
                  defaultValue: "left"
                }
              }
            },
            Background: {
              ref: "background",
              label: "Background",
              type: "items",
              items: {
                backgroundtype: {
                  type: "string",
                  component: "buttongroup",
                  ref: "bgtype",
                  options: [{
                    value: "color",
                    label: "Color",
                    tooltip: "Choose to pick a color"
                  }, {
                    value: "image",
                    label: "Image",
                    tooltip: "Choose to upload image"
                  }, {
                    value: "url",
                    label: "URL",
                    tooltip: "Embed URL"
                  }],
                  defaultValue: "color"
                },
                BGColorPicker: {
                  type: "object",
                  label: "Background Color",
                  component: "color-picker",
                  dualOutput: true,
                  ref: "bgColor",
                  show: function(layout) {
                    return "color" == layout.bgtype
                  },
                  defaultValue: "#ffffff"
                },
                backgroundimage: {
                  label: "Image",
                  component: "media",
                  ref: "bgimage",
                  layoutRef: "bgimage",
                  type: "string",
                  show: function(layout) {
                    return "image" == layout.bgtype
                  }
                },
                imagestretch: {
                  label: "Image Stretch",
                  type: "string",
                  ref: "imagestretch",
                  component: "dropdown",
                  options: [{
                    value: "nostretch",
                    label: "No Stretch"
                  }, {
                    value: "fill",
                    label: "Fill"
                  }, {
                    value: "keepaspect",
                    label: "Keep Aspect"
                  }, {
                    value: "fillwithaspect",
                    label: "Fill with Aspect"
                  }],
                  defaultValue: "nostretch",
                  show: function(layout) {
                    return "image" == layout.bgtype
                  }
                },
                backgroundtransparency: {
                  type: "number",
                  component: "slider",
                  label: "Transparency",
                  ref: "backgroundtransparency",
                  min: 0,
                  max: 1,
                  step: 0.1,
                  defaultValue: 1,
                  show: function(layout) {
                    return "url" != layout.bgtype
                  }
                },
                iframeurl: {
                  ref: "iframeurl",
                  label: "URL",
                  type: "string",
                  defaultValue: "https://",
                  show: function(layout) {
                    return "url" == layout.bgtype
                  }
                }
              }
            }
          }
        }
      }
    },
    snapshot: {
      canTakeSnapshot: true,
      export: true
    },
    paint: function($element,layout) {

      var vars = {
              myId : ($element.width(), $element.height(),"tb_" + layout.qInfo.qId),
              Texts : layout.text,
              Fontcolor : typeof(layout.fontcolor.color)!='undefined' ? layout.fontcolor.color: "#595959",
              Fontsize : layout.fontsize,
              Fontfamily : layout.fontfamily,
              Fontstyle : layout.fontstyle,
              Horizontalalignment : layout.horizontalalignment,
              Bgtype : layout.bgtype,
              Backgroundcolor : typeof(layout.bgColor.color)!='undefined' ? layout.bgColor.color: "#ffffff",
              Backgroundtransparency : layout.backgroundtransparency,
              Bgimage : layout.bgimage,
              Imagestretch : layout.imagestretch,
              Iframeurl : layout.iframeurl,
              myHtml : ''
      };

      vars.myHtml = '<div id="' + vars.myId + '" class="objectStyle"></div>' ;



      switch ($element.html(vars.myHtml), $element.find("#"+ vars.myId).css("color", vars.Fontcolor), $element.find(".objectStyle").css("font-size", vars.Fontsize), vars.Fontstyle) {
        case "bold":
          $element.find(".objectStyle").css("font-weight", "bold");
          break;
        case "italic":
          $element.find(".objectStyle").css("font-style", "italic");
          break;
        case "italicbold":
          $element.find(".objectStyle").css("font-style", "italic"), $element.find(".objectStyle").css("font-weight", "bold")
      }


      $element.find(".objectStyle").css("height", "100%");
      $element.find(".objectStyle").css("font-family", vars.Fontfamily);
      // $element.find(".objectStyle").css("opacity", vars.Backgroundtransparency);


      /// ---------- Reverse the color slider so that linear gradient used for obacity shows and hides the image (right to left) -------------------------------------------------------
      var bgtranspancy = 1 - vars.Backgroundtransparency;


      if ("color" == vars.Bgtype) $element.find(".objectStyle").css("background-color", vars.Backgroundcolor);
      else if ("url" == vars.Bgtype) vars.Texts += '<iframe src="' + vars.Iframeurl + '" width="100%" height="100%"  />';
      else switch ($element.find(".objectStyle").css("background-image", "linear-gradient(rgba(255,255,255,"+ bgtranspancy +") ,rgba(255,255,255,"+ bgtranspancy +")), url(" + vars.Bgimage + ")"),
        $element.find(".objectStyle").css("background-repeat", "no-repeat"), vars.Imagestretch) {
        case "fill":
          $element.find(".objectStyle").css("background-size", "100% 100%");
          break;
        case "keepaspect":
          $element.find(".objectStyle").css("background-size", "contain");
          break;
        case "fillwithaspect":
          $element.find(".objectStyle").css("background-size", "cover")
      }


      switch (vars.Horizontalalignment) {
        case "left":
          $element.find(".objectStyle").css("text-align", "left");
          break;
        case "center":
          $element.find(".objectStyle").css("text-align", "center");
          break;
        case "right":
          $element.find(".objectStyle").css("text-align", "right")
      }



      $element.find('#' + vars.myId).html(vars.Texts);

    return qlik.Promise.resolve();
    }
  }
});
