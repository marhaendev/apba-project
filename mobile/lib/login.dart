import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'config.dart';
import 'dashboard.dart';

// Global storage for token (simple implementation for 3-file constraint)
class GlobalAuth {
  static String? token;
  static String? role;
}

class LoginController extends GetxController {
  var email = ''.obs;
  var password = ''.obs;
  var isLoading = false.obs;

  final String baseUrl = AppConfig.baseUrl;

  Future<void> login() async {
    if (email.value.isEmpty || password.value.isEmpty) {
      Get.snackbar('Error', 'Username dan Password harus diisi');
      return;
    }

    isLoading.value = true;
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/login'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'username': email.value, 'password': password.value}),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        GlobalAuth.token = data['token'];

        // Decode token to get role
        try {
          final parts = GlobalAuth.token!.split('.');
          if (parts.length == 3) {
            final payloadStr = utf8.decode(
              base64Url.decode(base64Url.normalize(parts[1])),
            );
            final payload = jsonDecode(payloadStr);
            GlobalAuth.role = payload['role'];
          }
        } catch (e) {
          print('Error decoding token: $e');
        }

        Get.snackbar('Success', 'Login Berhasil');
        Get.off(() => DashboardPage());
      } else {
        final error = jsonDecode(response.body);
        Get.snackbar('Login Gagal', error['message'] ?? 'Unknown error');
      }
    } catch (e) {
      Get.snackbar('Error', 'Gagal terhubung ke server: $e');
    } finally {
      isLoading.value = false;
    }
  }
}

class LoginPage extends StatelessWidget {
  final LoginController controller = Get.put(LoginController());
  final FocusNode _passwordFocus = FocusNode();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('APBA Login')),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            TextField(
              onChanged: (value) => controller.email.value = value,
              decoration: InputDecoration(labelText: 'Username'),
              textInputAction: TextInputAction.next,
              onSubmitted: (_) {
                FocusScope.of(context).requestFocus(_passwordFocus);
              },
            ),
            TextField(
              focusNode: _passwordFocus,
              onChanged: (value) => controller.password.value = value,
              decoration: InputDecoration(labelText: 'Password'),
              obscureText: true,
              textInputAction: TextInputAction.done,
              onSubmitted: (_) => controller.login(),
            ),
            SizedBox(height: 20),
            Obx(
              () =>
                  controller.isLoading.value
                      ? CircularProgressIndicator()
                      : ElevatedButton(
                        onPressed: controller.login,
                        child: Text('Login'),
                      ),
            ),
          ],
        ),
      ),
    );
  }
}
