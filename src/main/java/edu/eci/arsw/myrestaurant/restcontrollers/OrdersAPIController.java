/*
 * Copyright (C) 2016 Pivotal Software, Inc.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
package edu.eci.arsw.myrestaurant.restcontrollers;

import com.google.gson.Gson;
import edu.eci.arsw.myrestaurant.model.Order;
import edu.eci.arsw.myrestaurant.model.ProductType;
import edu.eci.arsw.myrestaurant.model.RestaurantProduct;
import edu.eci.arsw.myrestaurant.services.OrderServicesException;
import edu.eci.arsw.myrestaurant.services.RestaurantOrderServices;
import edu.eci.arsw.myrestaurant.services.RestaurantOrderServicesStub;
import java.util.Collection;
import java.util.HashMap;
import java.util.Hashtable;
import java.util.Iterator;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.logging.Level;
import java.util.logging.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

/**
 *
 * @author hcadavid
 */
@RestController
@RequestMapping(value = "/orders")
public class OrdersAPIController {

    @Autowired
    RestaurantOrderServices restaurant;

    @RequestMapping(method = RequestMethod.GET)
    public ResponseEntity<?> getOrders() {
        Gson json = new Gson();
        HashMap<Integer, Order> map = new HashMap<>();
        Set<Integer> tables = restaurant.getTablesWithOrders();
        //---------//
        tables.forEach((i) -> {
            map.put(i, restaurant.getTableOrder(i));
        });
        String p = json.toJson(map);
        return new ResponseEntity<>(p, HttpStatus.OK);
    }

    @RequestMapping(method = RequestMethod.GET, path = "/{id}")
    public ResponseEntity<?> getOrderByTable(@PathVariable("id") int id) {

        HashMap<Integer, Order> map = new HashMap<>();

        map.put(id, restaurant.getTableOrder(id));

        return new ResponseEntity<>(map, HttpStatus.OK);
    }

    @RequestMapping(method = RequestMethod.POST)
    public ResponseEntity<?> postOrder(@RequestBody Map<Integer, Order> order) {
        try {
            Set<Integer> tables = order.keySet();

            for (Integer s : tables) {

                restaurant.addNewOrderToTable(order.get(s));
            }
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (OrderServicesException ex) {
            Logger.getLogger(OrdersAPIController.class.getName()).log(Level.SEVERE, null, ex);
            return new ResponseEntity<>(ex.toString(), HttpStatus.METHOD_NOT_ALLOWED);
        }
    }

    @RequestMapping(method = RequestMethod.GET, path = "/{idTable}/total")
    public ResponseEntity<?> getTotalTableBill(@PathVariable int idTable) {
        try {
            return new ResponseEntity<>(restaurant.calculateTableBill(idTable), HttpStatus.OK);
        } catch (OrderServicesException ex) {
            Logger.getLogger(OrdersAPIController.class.getName()).log(Level.SEVERE, null, ex);
            return new ResponseEntity<>(ex.getMessage(), HttpStatus.NOT_FOUND);
        }
    }
    
    @RequestMapping(method = RequestMethod.PUT,path="/{idTable}")
    public ResponseEntity<?> updateOrder(@PathVariable int idTable,@RequestBody Map<String, Integer> dish) {
        
         Set<String> tables = dish.keySet();
         
         for (String s : tables) {
             restaurant.getTableOrder(idTable).addDish(s,dish.get(s));
            
         }
        return new ResponseEntity<>(HttpStatus.OK);

    }
    
    @RequestMapping(method = RequestMethod.DELETE, path = "{idTable}")
    public ResponseEntity<?> deleteOrder(@PathVariable int idTable){
        try {
            restaurant.releaseTable(idTable);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (OrderServicesException ex) {
            Logger.getLogger(OrdersAPIController.class.getName()).log(Level.SEVERE, null, ex);
            return new ResponseEntity<>(ex.getMessage(), HttpStatus.NOT_FOUND);
            
        }
    }
    
}
