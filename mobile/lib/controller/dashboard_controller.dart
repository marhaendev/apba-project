import 'package:get/get.dart';
import '../login.dart';

class DashboardController extends GetxController {
  var count = 0.obs;

  void increment() {
    count++;
  }

  void logout() {
    Get.offAll(LoginPage());
  }
}
