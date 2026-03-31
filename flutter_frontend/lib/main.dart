import "dart:convert";

import "package:flutter/material.dart";
import "package:http/http.dart" as http;

void main() {
  runApp(const BharatSevaFlutterApp());
}

class BharatSevaFlutterApp extends StatelessWidget {
  const BharatSevaFlutterApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: "BharatSeva AI",
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        useMaterial3: true,
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF176F46),
          brightness: Brightness.light,
        ),
        scaffoldBackgroundColor: const Color(0xFFF5EEDC),
        fontFamily: "Roboto",
      ),
      home: const VoiceQueryPage(),
    );
  }
}

class VoiceQueryPage extends StatefulWidget {
  const VoiceQueryPage({super.key});

  @override
  State<VoiceQueryPage> createState() => _VoiceQueryPageState();
}

class _VoiceQueryPageState extends State<VoiceQueryPage> {
  static const String defaultBaseUrl = "http://10.0.2.2:8000";

  final TextEditingController _queryController = TextEditingController(
    text: "मुझे आवास योजना चाहिए",
  );
  final TextEditingController _baseUrlController = TextEditingController(
    text: defaultBaseUrl,
  );

  String _language = "hi";
  bool _isLoading = false;
  String? _error;
  VoiceQueryResponse? _response;

  @override
  void dispose() {
    _queryController.dispose();
    _baseUrlController.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    FocusScope.of(context).unfocus();

    setState(() {
      _isLoading = true;
      _error = null;
    });

    try {
      final uri = Uri.parse("${_baseUrlController.text.trim()}/voice-query");
      final result = await http.post(
        uri,
        headers: const {"Content-Type": "application/json"},
        body: jsonEncode(
          {
            "text": _queryController.text.trim(),
            "language": _language,
          },
        ),
      );

      if (result.statusCode < 200 || result.statusCode >= 300) {
        throw Exception("Backend returned ${result.statusCode}: ${result.body}");
      }

      final decoded = jsonDecode(result.body) as Map<String, dynamic>;
      setState(() {
        _response = VoiceQueryResponse.fromJson(decoded);
      });
    } catch (error) {
      setState(() {
        _error = error.toString();
      });
    } finally {
      if (mounted) {
        setState(() {
          _isLoading = false;
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            colors: [Color(0xFFF8F1E1), Color(0xFFECDDB9)],
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
          ),
        ),
        child: SafeArea(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                _HeroCard(
                  title: "BharatSeva AI",
                  subtitle:
                      "Flutter frontend for citizen voice queries, scheme matching, and auto-filled responses.",
                ),
                const SizedBox(height: 18),
                _GlassCard(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        "Backend Connection",
                        style: TextStyle(fontSize: 18, fontWeight: FontWeight.w800),
                      ),
                      const SizedBox(height: 12),
                      TextField(
                        controller: _baseUrlController,
                        decoration: const InputDecoration(
                          labelText: "Base URL",
                          hintText: "http://10.0.2.2:8000",
                          border: OutlineInputBorder(),
                        ),
                      ),
                      const SizedBox(height: 16),
                      DropdownButtonFormField<String>(
                        initialValue: _language,
                        decoration: const InputDecoration(
                          labelText: "Language",
                          border: OutlineInputBorder(),
                        ),
                        items: const [
                          DropdownMenuItem(value: "hi", child: Text("Hindi")),
                          DropdownMenuItem(value: "en", child: Text("English")),
                        ],
                        onChanged: (value) {
                          if (value == null) {
                            return;
                          }
                          setState(() {
                            _language = value;
                          });
                        },
                      ),
                      const SizedBox(height: 16),
                      TextField(
                        controller: _queryController,
                        minLines: 4,
                        maxLines: 6,
                        decoration: const InputDecoration(
                          labelText: "Citizen Query",
                          hintText: "Type what the citizen is asking for",
                          border: OutlineInputBorder(),
                        ),
                      ),
                      const SizedBox(height: 16),
                      SizedBox(
                        width: double.infinity,
                        child: FilledButton(
                          onPressed: _isLoading ? null : _submit,
                          style: FilledButton.styleFrom(
                            backgroundColor: const Color(0xFF176F46),
                            foregroundColor: Colors.white,
                            padding: const EdgeInsets.symmetric(vertical: 16),
                          ),
                          child: Text(_isLoading ? "Processing..." : "Send Voice Query"),
                        ),
                      ),
                    ],
                  ),
                ),
                if (_error != null) ...[
                  const SizedBox(height: 18),
                  _StatusCard(
                    title: "Request error",
                    value: _error!,
                    tone: const Color(0xFF8D2D2D),
                  ),
                ],
                if (_response != null) ...[
                  const SizedBox(height: 18),
                  _StatusCard(
                    title: "Workflow status",
                    value: _response!.status,
                    tone: const Color(0xFF176F46),
                  ),
                  const SizedBox(height: 18),
                  _GlassCard(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          "Matched Scheme",
                          style: TextStyle(fontSize: 18, fontWeight: FontWeight.w800),
                        ),
                        const SizedBox(height: 12),
                        Text(
                          _response!.schemeName,
                          style: const TextStyle(
                            fontSize: 24,
                            fontWeight: FontWeight.w900,
                          ),
                        ),
                        const SizedBox(height: 10),
                        Wrap(
                          spacing: 10,
                          runSpacing: 10,
                          children: _response!.form.entries.map((entry) {
                            return Container(
                              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                              decoration: BoxDecoration(
                                color: Colors.white.withValues(alpha: 0.72),
                                borderRadius: BorderRadius.circular(18),
                                border: Border.all(color: const Color(0x2216271D)),
                              ),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  Text(
                                    entry.key,
                                    style: const TextStyle(
                                      fontSize: 12,
                                      fontWeight: FontWeight.w700,
                                      color: Color(0xFF5A675D),
                                    ),
                                  ),
                                  const SizedBox(height: 4),
                                  Text(
                                    "${entry.value}",
                                    style: const TextStyle(
                                      fontSize: 16,
                                      fontWeight: FontWeight.w800,
                                      color: Color(0xFF16271D),
                                    ),
                                  ),
                                ],
                              ),
                            );
                          }).toList(),
                        ),
                      ],
                    ),
                  ),
                ],
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class VoiceQueryResponse {
  const VoiceQueryResponse({
    required this.status,
    required this.schemeName,
    required this.form,
  });

  final String status;
  final String schemeName;
  final Map<String, dynamic> form;

  factory VoiceQueryResponse.fromJson(Map<String, dynamic> json) {
    final response = (json["response"] as Map<String, dynamic>? ?? <String, dynamic>{});
    final scheme = (response["scheme"] as Map<String, dynamic>? ?? <String, dynamic>{});
    final form = (response["form"] as Map<String, dynamic>? ?? <String, dynamic>{});

    return VoiceQueryResponse(
      status: (response["status"] ?? "unknown").toString(),
      schemeName: (scheme["name"] ?? "Unknown Scheme").toString(),
      form: form,
    );
  }
}

class _HeroCard extends StatelessWidget {
  const _HeroCard({
    required this.title,
    required this.subtitle,
  });

  final String title;
  final String subtitle;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(28),
        gradient: const LinearGradient(
          colors: [Color(0xFF163222), Color(0xFF227C50)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        boxShadow: const [
          BoxShadow(
            color: Color(0x33163222),
            blurRadius: 30,
            offset: Offset(0, 18),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
            decoration: BoxDecoration(
              color: Colors.white.withValues(alpha: 0.14),
              borderRadius: BorderRadius.circular(999),
            ),
            child: const Text(
              "Citizen Service Frontend",
              style: TextStyle(
                color: Colors.white,
                fontWeight: FontWeight.w700,
              ),
            ),
          ),
          const SizedBox(height: 18),
          Text(
            title,
            style: const TextStyle(
              color: Colors.white,
              fontSize: 32,
              fontWeight: FontWeight.w900,
            ),
          ),
          const SizedBox(height: 10),
          Text(
            subtitle,
            style: const TextStyle(
              color: Color(0xFFE7F7ED),
              fontSize: 16,
              height: 1.5,
            ),
          ),
        ],
      ),
    );
  }
}

class _GlassCard extends StatelessWidget {
  const _GlassCard({required this.child});

  final Widget child;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white.withValues(alpha: 0.68),
        borderRadius: BorderRadius.circular(28),
        border: Border.all(color: const Color(0x26FFFFFF)),
        boxShadow: const [
          BoxShadow(
            color: Color(0x1A000000),
            blurRadius: 24,
            offset: Offset(0, 12),
          ),
        ],
      ),
      child: child,
    );
  }
}

class _StatusCard extends StatelessWidget {
  const _StatusCard({
    required this.title,
    required this.value,
    required this.tone,
  });

  final String title;
  final String value;
  final Color tone;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: Colors.white.withValues(alpha: 0.75),
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: tone.withValues(alpha: 0.18)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            title,
            style: TextStyle(
              color: tone,
              fontWeight: FontWeight.w700,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            value,
            style: const TextStyle(
              color: Color(0xFF16271D),
              fontSize: 18,
              fontWeight: FontWeight.w800,
            ),
          ),
        ],
      ),
    );
  }
}
