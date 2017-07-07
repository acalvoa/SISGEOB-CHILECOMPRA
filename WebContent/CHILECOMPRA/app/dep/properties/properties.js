// APP BEGIN
(function(){
	PROPERTIES = new function() {
        properties = null;

        function _contructor() {
            $.ajax({
                url: "CHILECOMPRA/app/config/properties.json",
                
                beforeSend: function(xhr){
                    if (xhr.overrideMimeType) {
                        xhr.overrideMimeType("application/json");
                    }
                },
                dataType: 'json',
                success: function(data) {
                    properties = data;
                }
            });
        }

        this.get_propertie = function(propertie_name, callback) {
            var self = this;
            if(properties == null) {
                setTimeout(function() {
                    self.get_propertie(propertie_name, callback);
                }, 100);
            } else {
                if(typeof properties[propertie_name] == "undefined") {
                    return null;
                }

                if(typeof callback != "undefined") {
                    callback(properties[propertie_name]);    
                }

                return properties[propertie_name];
            }
        }

        _contructor();
    };  
})();