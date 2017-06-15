(function()
{
   /**
    * YUI aliases
    */
   var Dom = YAHOO.util.Dom,
      Event = YAHOO.util.Event,
      Element = YAHOO.util.Element;

   /**
    * Alfresco Slingshot aliases
    */
   var $html = Alfresco.util.encodeHTML;

   /**
    * EPubViewer plug-in constructor
    *
    * @constructor
    * @param wp {Alfresco.WebPreview} The Alfresco.WebPreview instance that decides which plugin to use
    * @param attributes {object} Arbitrary attributes brought in from the <plugin> element
    */
   Alfresco.WebPreview.prototype.Plugins.EPubViewer = function(wp, attributes)
   {
      this.wp = wp;
      this.id = wp.id; // needed by Alfresco.util.createYUIButton
      this.attributes = YAHOO.lang.merge(Alfresco.util.deepCopy(this.attributes), attributes);

      return this;
   };

   Alfresco.WebPreview.prototype.Plugins.EPubViewer.prototype =
   {
      /**
       * Configuration attributes
       *
       * @property attributes
       * @type object
       */
      attributes:
      {
               /**
                * Decides if the node's content or one of its thumbnails shall be
                * displayed. Leave it as it is if the node's content shall be used. Set
                * to a custom thumbnail definition name if the node's thumbnail contains
                * the EPub to display.
                *
                * @property src
                * @type String
                * @default null
                */
               src : null,

               /**
                * Maximum file size in bytes which should be displayed. Note that this refers to
                * the size of the original file and not the EPub rendition, which may be larger or
                * smaller than this value. Empty or non-numeric string means no limit.
                *
                * @property srcMaxSize
                * @type String
                * @default "2000000" don't allow larger files than 2MB at the moment
                */
               srcMaxSize: "2000000"
      }

      /**
       * Tests if the EPubViewer plugin can be used in the users browser.
       *
       * @method report
       * @return {String} Returns nothing if the EPub plugin may be used, otherwise
       *         returns a message containing the reason it can't be used as a string.
       * @public
       */
      report : function EPubViewer_report()
      {
         var srcMaxSize = this.attributes.srcMaxSize;
         if (!this.attributes.src &&
                srcMaxSize.match(/^\d+$/) &&
                this.wp.options.size > parseInt(srcMaxSize)) {
            return this.wp.msg(
                "EPub.tooLargeFile",
                this.wp.options.name,
                Alfresco.util.formatFileSize(this.wp.options.size),
                parseInt(srcMaxSize));
         }
      },

      /**
       * Display the node.
       *
       * @method display
       * @public
       */
      display : function EPubViewer_display()
      {
         /* Get the URL to the EPUB file in Alfresco */
         var src = this.wp.getContentUrl();

         /* Create the EPUB renderer object */
         var Book = ePub(src);

         /* Manipulate the DOM and inject EPUB renderer stuff */
        <div id="main">
          <div id="prev" onclick="Book.prevPage();" class="arrow">‹</div>
          <div id="area"></div>
          <div id="next" onclick="Book.nextPage();" class="arrow">›</div>
        </div>

         /* Render Book EPUB */
         Book.renderTo("area");

         return null; /* returning null as we have done DOM manipulation */
      }
   };
})();