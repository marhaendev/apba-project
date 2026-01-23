import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'controller/dashboard_controller.dart';

class DashboardPage extends StatelessWidget {
  final DashboardController controller = Get.put(DashboardController());

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Dashboard'),
        actions: [
          IconButton(
            icon: Icon(Icons.logout),
            onPressed: controller.logout,
          )
        ],
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(
              'Counter Value:',
              style: TextStyle(fontSize: 20),
            ),
            Obx(() => Text(
                  '${controller.count}',
                  style: TextStyle(fontSize: 40, fontWeight: FontWeight.bold),
                )),
            SizedBox(height: 20),
            ElevatedButton(
              onPressed: controller.increment,
              child: Text('Increment'),
            ),
          ],
        ),
      ),
    );
  }
}
