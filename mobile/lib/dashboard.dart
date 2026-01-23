import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'login.dart';
import 'config.dart';

class DashboardController extends GetxController {
  var users = <dynamic>[].obs;
  var isLoading = false.obs;
  final String baseUrl = AppConfig.baseUrl;

  @override
  void onInit() {
    super.onInit();
    fetchUsers();
  }

  Map<String, String> get _headers => {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ${GlobalAuth.token}',
  };

  Future<void> fetchUsers({bool isBackground = false}) async {
    if (!isBackground) isLoading.value = true;
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/users?page=1&limit=100'),
        headers: _headers,
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        // Use assignAll to ensure Obx triggers properly
        users.assignAll(data['data']);
      } else if (response.statusCode == 401) {
        Get.snackbar('Session Expired', 'Please login again');
        logout();
      } else {
        Get.snackbar('Error', 'Failed to load users: ${response.statusCode}');
      }
    } catch (e) {
      Get.snackbar('Error', 'Connection error: $e');
    } finally {
      isLoading.value = false;
    }
  }

  Future<void> deleteUser(int id) async {
    try {
      final response = await http.delete(
        Uri.parse('$baseUrl/users/$id'),
        headers: _headers,
      );

      if (response.statusCode == 200) {
        fetchUsers(isBackground: true);
        Get.snackbar('Success', 'User deleted');
      } else {
        final err = jsonDecode(response.body);
        Get.snackbar('Error', err['message'] ?? 'Failed to delete user');
      }
    } catch (e) {
      Get.snackbar('Error', 'Connection error: $e');
    }
  }

  Future<void> createUser(Map<String, dynamic> userData) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/users'),
        headers: _headers,
        body: jsonEncode(userData),
      );

      if (response.statusCode == 200 || response.statusCode == 201) {
        // Backend returns 200 or 201? Code says res.json() which is 200 by default but let's be safe. Code says 200 actually. Wait, code says `res.json`. Wait, previous code checked 201. Let's check backend.
        // Backend: res.json(...) -> 200 OK by default.

        // Manual Update for Instant UI Feedback
        final responseData = jsonDecode(response.body);
        if (responseData['data'] != null) {
          users.add(responseData['data']);
          users.refresh(); // Force refresh just in case
        }

        Get.snackbar('Success', 'User created');

        // Still fetch in background to sync fully
        fetchUsers(isBackground: true);
      } else {
        final err = jsonDecode(response.body);
        Get.snackbar('Error', err['message'] ?? 'Failed to create user');
      }
    } catch (e) {
      Get.snackbar('Error', 'Connection error: $e');
    }
  }

  void logout() {
    GlobalAuth.token = null;
    Get.offAll(() => LoginPage());
  }
}

class DashboardPage extends StatelessWidget {
  final DashboardController controller = Get.put(DashboardController());

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('APBA Dashboard'),
        actions: [
          IconButton(icon: Icon(Icons.logout), onPressed: controller.logout),
        ],
      ),
      body: Obx(() {
        if (controller.isLoading.value) {
          return Center(child: CircularProgressIndicator());
        }
        return RefreshIndicator(
          onRefresh: () => controller.fetchUsers(isBackground: true),
          child: ListView.builder(
            itemCount: controller.users.length,
            itemBuilder: (context, index) {
              final user = controller.users[index];
              return ListTile(
                leading: CircleAvatar(
                  child: Text(user['username'][0].toString().toUpperCase()),
                ),
                title: Text(user['username']),
                subtitle: Text(
                  (user['nama'] ?? 'No Name') + ' (${user['hakakses']})',
                ),
                trailing: IconButton(
                  icon: Icon(Icons.delete, color: Colors.red),
                  onPressed: () => _confirmDelete(context, user['id_user']),
                ),
              );
            },
          ),
        );
      }),
      floatingActionButton: FloatingActionButton(
        child: Icon(Icons.add),
        onPressed: () => _showAddUserDialog(context),
      ),
    );
  }

  void _confirmDelete(BuildContext context, int id) {
    Get.dialog(
      AlertDialog(
        title: Text("Delete User"),
        content: Text("Are you sure you want to delete this user?"),
        actions: [
          TextButton(onPressed: () => Get.back(), child: Text("No")),
          TextButton(
            onPressed: () {
              Get.back(); // Close dialog immediately
              controller.deleteUser(id);
            },
            child: Text("Yes"),
          ),
        ],
      ),
    );
  }

  void _showAddUserDialog(BuildContext context) {
    final usernameController = TextEditingController();
    final passwordController = TextEditingController();
    final namaController = TextEditingController();
    final roleController = TextEditingController(text: 'user');

    Get.defaultDialog(
      title: "Add User",
      content: Column(
        children: [
          TextField(
            controller: usernameController,
            decoration: InputDecoration(labelText: "Username"),
          ),
          TextField(
            controller: passwordController,
            decoration: InputDecoration(labelText: "Password"),
          ),
          TextField(
            controller: namaController,
            decoration: InputDecoration(labelText: "Full Name"),
          ),
          TextField(
            controller: roleController,
            decoration: InputDecoration(labelText: "Role (admin/user)"),
          ),
        ],
      ),
      textConfirm: "Save",
      textCancel: "Cancel",
      onConfirm: () {
        Get.back(); // Close immediately
        controller.createUser({
          'username': usernameController.text,
          'password': passwordController.text,
          'nama': namaController.text,
          'hakakses': roleController.text,
        });
      },
    );
  }
}
