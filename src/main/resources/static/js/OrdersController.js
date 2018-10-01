/* global axios */

var OrdersControllerModule = (function () {
    
    var selectedOrder;

    var showOrdersByTable = function () {
    
        var callback = {

            onSuccess: function(orders){

                for (j in orders){

                    var dvTable = document.getElementById("Tables");

                    var header = new Array();
                        header.push("Product");
                        header.push("Quantity");

                    var table = document.createElement("table");
                    table.border = "1";
                    table.setAttribute("id","Table"+j);
                    table.setAttribute("class","table table-sm table-dark");

                    var column = 2;
                    var row = table.insertRow(-1);
                    var headerTable = document.createElement("th");
                    headerTable.setAttribute("colspan","3");
                    headerTable.innerHTML = "Table "+j;
                    row.appendChild(headerTable);

                    var row = table.insertRow(-1);
                    for (var i=0;i<column;i++){
                        var headerCell = document.createElement("th");
                        headerCell.innerHTML = header[i];
                        row.appendChild(headerCell);
                    }

                    for (var i=0;i<Object.keys(orders[j].orderAmountsMap).length;i++){
                        row = table.insertRow(-1);
                        var cell = row.insertCell(-1);
                        cell.innerHTML = Object.keys(orders[j].orderAmountsMap)[i];
                        var cell = row.insertCell(-1);
                        cell.innerHTML = orders[j].orderAmountsMap[Object.keys(orders[j].orderAmountsMap)[i]];
                    }

                    dvTable.appendChild(document.createElement("br"));
                    dvTable.appendChild(table);
                }

            },
            onFailed: function(exception){
                console.log(exception);
                alert("There is a problem with our servers. We apologize for the inconvince, please try again later");
            }
   
        };
    
        RestControllerModule.getOrders(callback);
    };

    var updateOrder = function (orderId) {
        
        var len = Object.keys(selectedOrder[orderId].orderAmountsMap).length;
        selectedOrder[orderId].orderAmountsMap = {};
        
        for (var i=1; i<len+1; i++ ){
            selectedOrder[orderId].orderAmountsMap[$("#item"+i).val()] = parseInt($("#quantity"+i).val());
        }
        var callback = {
            onSuccess: function (){
                selectTable();
            },
            onFailed: function (exception){
                console.log(exception);
                alert("There is a problem with our servers. We apologize for the inconvince, please try again later");
            }
        };
        RestControllerModule.updateOrder(selectedOrder[orderId], callback);
    };

    var deleteOrderItem = function (itemName) {
        delete selectedOrder[sel].orderAmountsMap[itemName];
        var callback = {
            onSuccess: function (){
                selectTable();
            },
            onFailed: function(exception){
                console.log(exception);
                alert("There is a problem with our servers. We apologize for the inconvince, please try again later");
            }
        };
        RestControllerModule.deleteOrder(sel,itemName, callback);
    };

    var addItemToOrder = function (orderId, item) {
        var itemName = item[0];
        var itemQuantity = item[1];
        if (Object.keys(selectedOrder[orderId].orderAmountsMap).includes(itemName)){
            selectedOrder[orderId].orderAmountsMap[itemName] += parseInt(itemQuantity);
        }else{
            selectedOrder[orderId].orderAmountsMap[itemName] = parseInt(itemQuantity);
        }
        var callback = {
            onSuccess: function (){
                selectTable();
            },
            onFailed: function(exception){
                console.log(exception);
                alert("There is a problem with our servers. We apologize for the inconvince, please try again later");
            }
        };
        RestControllerModule.addItem(orderId, item, callback);
    };
    
    var loadSelectedTables = function (){
        var callback = {
            onSuccess: function(orders){
                $('#orders').empty();
                $('#orders').append("<option value='0'></option>");
                for (i in orders){
                    $('#orders').append("<option value='"+i+"'>Table "+i+"</option>");
                }
            },
            onFailed: function(exception){
                console.log(exception);
                alert("There is a problem with our servers. We apologize for the inconvince, please try again later");
            }
        };
        RestControllerModule.getOrders(callback);
    };
    
    var selectTable = function (){
        
        var index = document.getElementById("orders");
        sel = index.options[index.selectedIndex].value;
       
        var callback = {
            onSuccess: function (order){
                selectedOrder = order;
                $('#tableSelect').empty();
                $('#tableSelect').append("<thead> <tr> <th class='col'>Item</th> <th class='col'>Quantity</th> <th class='col'></th> <th class='col'></th> </tr> </thead>");
                var id=1;
                for(i in order[sel].orderAmountsMap){
                    $('#tableSelect').append("<tbody> <tr> <td> <input id='item"+id+"' type='text' value='"+i+"'> </td> <td> <input id='quantity"+id+"' type='text' value='"+order[sel].orderAmountsMap[i]+"'> </td> <td> <td> <button id='delete"+id+"' type='button' class='btn btn-dark'>Delete</button> </td> <td> <button id='update"+id+"' type='button' class='btn btn-dark' >Update</button> </td> </td> </tr> </tbody>");
                    document.getElementById('update'+id).setAttribute("onclick","OrdersControllerModule.updateOrder('"+$('#orders').val()+"')");
                    document.getElementById('delete'+id).setAttribute("onclick","OrdersControllerModule.deleteOrderItem('"+$('#item'+id).val()+"')");
                    id+=1;
                }
            },
            onFailed: function(exception){
                alert(exception);
                console.log("There is a problem with our servers. We apologize for the inconvince, please try again later");
            }
        };
        RestControllerModule.showOrder(sel, callback);
    };

    return {
        showOrdersByTable: showOrdersByTable,
        updateOrder: updateOrder,
        deleteOrderItem: deleteOrderItem,
        addItemToOrder: addItemToOrder,
        selectTable: selectTable,
        loadSelectedTables: loadSelectedTables
    };

})();