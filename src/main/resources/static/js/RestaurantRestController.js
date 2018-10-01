/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var RestControllerModule = (function () {

    var getOrders = function (callback) {
        axios.get('/orders')
            .then(function (orders){
                callback.onSuccess(orders.data);
            })
            .catch(function (error) {
                callback.onFailed(error);
            });
    };

    var updateOrder = function (order, callback) {
        axios.post('/orders', order)
            .then(function(){
                callback.onSuccess();
            })
            .catch(function(error){
                callback.onFailed(error);
            });
    };

    var deleteOrder = function (orderId, itemName, callback) {
        axios.delete('/orders/'+orderId+'/'+itemName)
            .then(function(){
                callback.onSuccess();
            })
            .catch(function (error){
                callback.onFailed(error);
            });
    };

    var createOrder = function (order, callback) {
        // todo implement
    };
    
    var showOrder = function (orderId, callback){
        axios.get('/orders/'+orderId)
            .then(function (orders){
                callback.onSuccess(orders.data);
            })
            .catch(function(error){
                callback.onFailed(error);
            });
    };
    
    var addItem = function (orderId, itemName, callback){
        axios.put('/orders/'+orderId, itemName)
            .then(function (orders){
                callback.onSuccess(orders.data);
            })
            .catch(function (error){
                callback.onFailed(error);
            })
    }

    return {
        getOrders: getOrders,
        updateOrder: updateOrder,
        deleteOrder: deleteOrder,
        createOrder: createOrder,
        showOrder: showOrder,
        addItem: addItem
    };

})();