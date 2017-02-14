(function(){
    var div = document.createElement('div');
    div.style.backgroundColor = 'AliceBlue';
    div.style.position = 'fixed';
    div.style.right = 0;
    div.style.top = 0;
    document.body.appendChild(div);

    function updateInfo(){
        var content = 'size: ' + Math.floor(ImageManager._imageCache._getSize()/1000)/1000 + 'MPix<br>';
        content += 'totalCount: ' + ImageManager._imageCache._countBitmap() + '<br>';
        content += 'requestCount: ' + ImageManager._imageCache._countRequest() + '<br>';
        content += 'reservedCount: ' + ImageManager._imageCache._countReserved() + '<br>';

        div.innerHTML = content;
        div.style.zIndex = 11;
    }

    var ImageManager_update = ImageManager.update;
    ImageManager.update = function(){
        ImageManager_update.call(this);
        updateInfo();
    }

    ImageCache.prototype._getSize = function(){
        var totalSize = 0;
        var items = this._items;

        Object.keys(items).forEach(function(key){
            var bitmap = items[key].bitmap;
            totalSize += bitmap.width * bitmap.height;
        });

        return totalSize;
    };

    ImageCache.prototype._countBitmap = function(){
        return Object.keys(this._items).length;
    };

    ImageCache.prototype._countRequest = function(){
        var items = this._items;

        return Object.keys(this._items)
            .map(function(key){
                return items[key].bitmap;
            }).filter(function(bitmap){
                return bitmap.isRequestOnly();
            }).length;
    };

    ImageCache.prototype._countReserved = function(){
        var items = this._items;

        return Object.keys(this._items)
            .map(function(key){
                return items[key].reservationId;
            }).filter(function(id){
                return id;
            }).length;
    };
})();