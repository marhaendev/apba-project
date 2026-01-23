import 'package:flutter_dotenv/flutter_dotenv.dart';

class AppConfig {
  static String get baseUrl =>
      dotenv.get('MOBILE_API_URL', fallback: 'http://192.168.1.12:3001/api');
}
