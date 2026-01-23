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

  var searchQuery = ''.obs;
  var selectedRole = ''.obs;
  var sortColumn = 'username'.obs;
  var isAscending = true.obs;

  List<dynamic> get filteredUsers {
    List<dynamic> list = List.from(users);

    // Role Filtering
    if (selectedRole.value.isNotEmpty) {
      list = list.where((u) => u['hakakses'] == selectedRole.value).toList();
    }

    // Search Filtering
    if (searchQuery.value.isNotEmpty) {
      list =
          list.where((u) {
            final query = searchQuery.value.toLowerCase();
            return u['username'].toString().toLowerCase().contains(query) ||
                (u['nama'] ?? '').toString().toLowerCase().contains(query);
          }).toList();
    }

    // Sorting
    list.sort((a, b) {
      final valA = (a[sortColumn.value] ?? '').toString().toLowerCase();
      final valB = (b[sortColumn.value] ?? '').toString().toLowerCase();
      int res = valA.compareTo(valB);
      return isAscending.value ? res : -res;
    });

    return list;
  }

  @override
  void onInit() {
    super.onInit();
    fetchUsers();
  }

  void toggleSort(String col) {
    if (sortColumn.value == col) {
      isAscending.toggle();
    } else {
      sortColumn.value = col;
      isAscending.value = true;
    }
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
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(8.0),
            child: TextField(
              onChanged: (value) => controller.searchQuery.value = value,
              decoration: InputDecoration(
                hintText: 'Cari user...',
                prefixIcon: Icon(Icons.search),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(8),
                ),
                contentPadding: EdgeInsets.symmetric(vertical: 0),
              ),
            ),
          ),
          Obx(
            () => SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              padding: EdgeInsets.symmetric(horizontal: 16, vertical: 4),
              child: Row(
                children: [
                  _sortChip('username', 'Username'),
                  SizedBox(width: 4),
                  _sortChip('hakakses', 'Role'),
                  SizedBox(width: 12),
                  Container(width: 1, height: 20, color: Colors.grey.shade300),
                  SizedBox(width: 12),
                  _roleChip('', 'Semua'),
                  SizedBox(width: 4),
                  _roleChip('admin', 'Admin'),
                  SizedBox(width: 4),
                  _roleChip('user', 'User'),
                ],
              ),
            ),
          ),
          Expanded(
            child: Obx(() {
              if (controller.isLoading.value) {
                return Center(child: CircularProgressIndicator());
              }
              final displayUsers = controller.filteredUsers;
              return RefreshIndicator(
                onRefresh: () => controller.fetchUsers(isBackground: true),
                child:
                    displayUsers.isEmpty
                        ? Center(child: Text("Tidak ada data pengguna"))
                        : ListView.builder(
                          itemCount: displayUsers.length,
                          itemBuilder: (context, index) {
                            final user = displayUsers[index];
                            return ListTile(
                              leading: CircleAvatar(
                                backgroundColor: Colors.blue.shade100,
                                child: Text(
                                  '${index + 1}',
                                  style: TextStyle(
                                    color: Colors.blue.shade900,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                              ),
                              title: Text(user['username']),
                              subtitle: Text(
                                (user['nama'] ?? 'No Name') +
                                    ' (${user['hakakses']})',
                              ),
                              trailing:
                                  GlobalAuth.role == 'admin'
                                      ? IconButton(
                                        icon: Icon(
                                          Icons.delete,
                                          color: Colors.red,
                                        ),
                                        onPressed:
                                            () => _confirmDelete(
                                              context,
                                              user['id_user'],
                                            ),
                                      )
                                      : null,
                            );
                          },
                        ),
              );
            }),
          ),
        ],
      ),
      floatingActionButton:
          GlobalAuth.role == 'admin'
              ? FloatingActionButton(
                child: Icon(Icons.add),
                onPressed: () => _showAddUserDialog(context),
              )
              : null,
    );
  }

  Widget _sortChip(String col, String label) {
    return ActionChip(
      label: Text(
        label +
            (controller.sortColumn.value == col
                ? (controller.isAscending.value ? ' ↑' : ' ↓')
                : ''),
      ),
      labelStyle: TextStyle(
        fontSize: 11,
        color: controller.sortColumn.value == col ? Colors.white : Colors.black,
      ),
      backgroundColor:
          controller.sortColumn.value == col
              ? Colors.blue
              : Colors.grey.shade200,
      padding: EdgeInsets.zero,
      onPressed: () => controller.toggleSort(col),
    );
  }

  Widget _roleChip(String role, String label) {
    return Obx(() {
      final isSelected = controller.selectedRole.value == role;
      return ActionChip(
        label: Text(label),
        labelStyle: TextStyle(
          fontSize: 10,
          color: isSelected ? Colors.white : Colors.black87,
        ),
        backgroundColor: isSelected ? Colors.orange : Colors.grey.shade100,
        padding: EdgeInsets.zero,
        onPressed: () => controller.selectedRole.value = role,
        visualDensity: VisualDensity.compact,
      );
    });
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
