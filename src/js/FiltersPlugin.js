export const FiltersPlugin = {
  install(app) {
    // Comma separate long numerical values
    app.config.globalProperties.$toCommas = function(num, decimals) {
      let o = { style: 'decimal', minimumFractionDigits: decimals, maximumFractionDigits: decimals };
      return new Intl.NumberFormat('en-US', o).format(num);
    };

    // Sanitize text data by only allowing alnums and some symbols
    app.config.globalProperties.$toText = function(str, def) {
      str = String(str || '').replace(/[^\w\`\'\-\,\.\!\?]+/g, ' ').replace(/\s\s+/g, ' ').trim();
      return str || String(def || '');
    };

    // Limit text length by number of characters
    app.config.globalProperties.$strLimit = function(value, size) {
      if (!value) return '';
      value = value.toString();

      if (value.length <= size) {
        return value;
      }
      return value.substr(0, size) + '...';
    };
  }
};
