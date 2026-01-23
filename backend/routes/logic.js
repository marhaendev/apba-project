const express = require('express');
const router = express.Router();

// 4. Script Array
// Array1 = [2, 5, 8, 9]
// Array2 = [1, 2, 3, 4, 5, 6, 7]
// Result = [1, 3, 4, 6, 7] (Array2 - Array1)
router.get('/array', (req, res) => {
    const array1 = [2, 5, 8, 9];
    const array2 = [1, 2, 3, 4, 5, 6, 7];

    const result = array2.filter(x => !array1.includes(x));

    res.json({
        array1,
        array2,
        result
    });
});

// 5. Script String
// Input: "PT.AbadI*perKASa@BeRsAmA-DIGItAL#SolUTiONs"
// Output: "PT. Abadi Perkasa Bersama Digital Solutions"
router.get('/string', (req, res) => {
    const input = req.query.input || "PT.AbadI*perKASa@BeRsAmA-DIGItAL#SolUTiONs";

    // Steps:
    // 1. Replace special chars with space (keep dots for PT.)
    // But example shows "PT. Abadi..." so we might want to handle "PT." specifically or just allow dots.
    // The requirement says "bersihkan special char". * @ - # are special chars.

    let clean = input.replace(/[*@\-#]/g, ' ');
    // "PT.AbadI perKASa BeRsAmA DIGItAL SolUTiONs"

    // Fix camelCase/Current casing to specific format.
    // "PT. Abadi Perkasa ... " requires spaces after dots if missing? 
    // "PT." is preserved.

    // Split by space to handle words
    let words = clean.split(' ');

    // Capitalize proper (First letter caps, rest lower)
    // Handle "PT." special case?
    // "PT.AbadI" -> "PT. Abadi"? Or is it two words "PT." and "Abadi"?
    // If we assume the input is sticking words together: "PT.AbadI"

    // Let's try a regex approach to separate words based on the expected output.
    // Expected: "PT. Abadi Perkasa Bersama Digital Solutions"

    // Maybe replace special chars with ' ' then normalize.

    // Let's implement function to Capitalize
    const capitalize = (s) => {
        if (s.toLowerCase() === 'pt.') return 'PT.'; // Keep PT. uppercase? Or "Pt."? Example says "PT."
        if (s.includes('.')) {
            // Handle "PT." prefix case
            if (s.toLowerCase().startsWith('pt.')) {
                const rest = s.substring(3);
                if (rest) {
                    return 'PT. ' + capitalize(rest);
                }
                return 'PT.';
            }
        }
        return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
    };

    // Refined logic:
    // 1. Replace * @ - # with space
    let step1 = input.replace(/[*@\-#]/g, ' ');
    // 2. Insert space after . if not present?
    // "PT.AbadI" -> "PT. Abadi"
    let step2 = step1.replace(/\./g, '. '); // "PT. AbadI..."

    // 3. Normalize spaces
    let step3 = step2.replace(/\s+/g, ' ').trim();

    // 4. Capitalize each word
    let final = step3.split(' ').map(w => {
        if (w.toUpperCase() === 'PT.') return 'PT.';
        return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
    }).join(' ');

    res.json({
        input,
        output: final
    });
});

// 6. Konversi Nominal ke Terbilang
// Nominal: Rp.10.113.199,50
// Terbilang: "Sepuluh Juta Seratus Tiga Belas Ribu Seratus Sembilan Puluh Sembilan Koma Lima Puluh Rupiah"
router.get('/terbilang', (req, res) => {
    // Accepting 'nominal' query param or default
    const nominalStr = req.query.nominal || "10113199.50";
    const nominal = parseFloat(nominalStr);

    function penyebut(nilai) {
        nilai = Math.abs(nilai);
        const huruf = ["", "Satu", "Dua", "Tiga", "Empat", "Lima", "Enam", "Tujuh", "Delapan", "Sembilan", "Sepuluh", "Sebelas"];
        let temp = "";
        if (nilai < 12) {
            temp = " " + huruf[Math.floor(nilai)];
        } else if (nilai < 20) {
            temp = penyebut(nilai - 10) + " Belas";
        } else if (nilai < 100) {
            temp = penyebut(nilai / 10) + " Puluh" + penyebut(nilai % 10);
        } else if (nilai < 200) {
            temp = " Seratus" + penyebut(nilai - 100);
        } else if (nilai < 1000) {
            temp = penyebut(nilai / 100) + " Ratus" + penyebut(nilai % 100);
        } else if (nilai < 2000) {
            temp = " Seribu" + penyebut(nilai - 1000);
        } else if (nilai < 1000000) {
            temp = penyebut(nilai / 1000) + " Ribu" + penyebut(nilai % 1000);
        } else if (nilai < 1000000000) {
            temp = penyebut(nilai / 1000000) + " Juta" + penyebut(nilai % 1000000);
        } else if (nilai < 1000000000000) {
            temp = penyebut(nilai / 1000000000) + " Milyar" + penyebut(nilai % 1000000000);
        } else if (nilai < 1000000000000000) {
            temp = penyebut(nilai / 1000000000000) + " Trilyun" + penyebut(nilai % 1000000000000);
        }
        return temp;
    }

    // Split for decimal
    const parts = nominal.toFixed(2).split('.');
    const whole = parseInt(parts[0]);
    const decimal = parseInt(parts[1]);

    let result = penyebut(whole);

    if (decimal > 0) {
        result += " Koma" + penyebut(decimal);
    }

    result += " Rupiah";

    res.json({
        nominal: nominalStr,
        terbilang: result.trim()
    });
});

module.exports = router;
