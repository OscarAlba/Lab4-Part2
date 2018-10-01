package edu.eci.arsw.myrestaurant.test;

import edu.eci.arsw.myrestaurant.beans.BillCalculator;
import edu.eci.arsw.myrestaurant.model.Order;
import edu.eci.arsw.myrestaurant.restcontrollers.OrdersAPIController;
import edu.eci.arsw.myrestaurant.services.OrderServicesException;
import edu.eci.arsw.myrestaurant.services.RestaurantOrderServicesStub;
import java.util.logging.Level;
import java.util.logging.Logger;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.fail;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringBootConfiguration;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@RunWith(SpringRunner.class)
@SpringBootTest()
public class ApplicationServicesTests {

    @Autowired
    RestaurantOrderServicesStub ros;

    
    @Test
    public void contextLoads() throws OrderServicesException{        
        
    }
    
    @Test
    public void calcularTotal() throws OrderServicesException{
        int totalCalculado = ros.calculateTableBill(1);
        float totalEsperado = (10000*3)+(10000*3*0.19f)+(3000)+(3000*0.19f)+(1300*4)+(1300*4*0.16f);
        int totalCalculadoManual = (int) totalEsperado;
        org.junit.Assert.assertEquals(totalCalculado,totalCalculadoManual);
    }
 
}
