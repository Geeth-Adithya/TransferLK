<?php
// insert_schools.php - Populate Sri Lanka schools across all 9 provinces and 25 districts
require_once 'h:/React/TransferLK/backend/config/database.php';

$conn = getConnection();

$schools = [
    // ── Western Province ───────────────────────────────────────
    // Colombo District
    ['Royal College', 'Western', 'Colombo', 'National'],
    ['Ananda College', 'Western', 'Colombo', 'National'],
    ['Nalanda College', 'Western', 'Colombo', 'National'],
    ['D.S. Senanayake College', 'Western', 'Colombo', 'National'],
    ['Mahanama College', 'Western', 'Colombo', 'National'],
    ['Thurstan College', 'Western', 'Colombo', 'National'],
    ['Isipathana College', 'Western', 'Colombo', 'National'],
    ["St. Joseph's College", 'Western', 'Colombo', 'National'],
    ["St. Peter's College", 'Western', 'Colombo', 'National'],
    ["St. Benedict's College", 'Western', 'Colombo', 'National'],
    ['Wesley College', 'Western', 'Colombo', 'National'],
    ['Hindu College Colombo', 'Western', 'Colombo', 'National'],
    ['Visakha Vidyalaya', 'Western', 'Colombo', 'National'],
    ['Devi Balika Vidyalaya', 'Western', 'Colombo', 'National'],
    ['Sirimavo Bandaranaike Vidyalaya', 'Western', 'Colombo', 'National'],
    ['Anula Vidyalaya Nugegoda', 'Western', 'Colombo', 'National'],
    ["St. Paul's Girls School Milagiriya", 'Western', 'Colombo', 'National'],
    ['Buddhist Ladies College', 'Western', 'Colombo', 'National'],
    ['Musaeus College', 'Western', 'Colombo', 'National'],
    ['Ramanathan Hindu Ladies College', 'Western', 'Colombo', 'National'],
    ["President's College Kotte", 'Western', 'Colombo', 'National'],
    ['Prince of Wales College Moratuwa', 'Western', 'Colombo', 'National'],
    ['Princess of Wales College Moratuwa', 'Western', 'Colombo', 'National'],
    ['Moratu Maha Vidyalaya', 'Western', 'Colombo', 'Provincial'],
    ['Piliyandala Central College', 'Western', 'Colombo', 'National'],
    ['Lumbini College', 'Western', 'Colombo', 'National'],
    ['Ananda Sastralaya Kotte', 'Western', 'Colombo', 'National'],
    ['Sri Jayawardenepura Maha Vidyalaya', 'Western', 'Colombo', 'Provincial'],
    ['Asoka Vidyalaya Colombo', 'Western', 'Colombo', 'National'],
    ['C.W.W. Kannangara Vidyalaya Colombo', 'Western', 'Colombo', 'Provincial'],

    // Gampaha District
    ['Bandaranayake College Gampaha', 'Western', 'Gampaha', 'National'],
    ['Rathnavali Balika Vidyalaya Gampaha', 'Western', 'Gampaha', 'National'],
    ['Holy Cross College Gampaha', 'Western', 'Gampaha', 'National'],
    ['Maris Stella College Negombo', 'Western', 'Gampaha', 'National'],
    ['Newstead Girls College Negombo', 'Western', 'Gampaha', 'National'],
    ['Harischandra National College Negombo', 'Western', 'Gampaha', 'National'],
    ["St. Mary's College Negombo", 'Western', 'Gampaha', 'National'],
    ['Henegama Central College', 'Western', 'Gampaha', 'National'],
    ['Thakshila Maha Vidyalaya Gampaha', 'Western', 'Gampaha', 'National'],
    ['Sri Dharmaloka College Kelaniya', 'Western', 'Gampaha', 'National'],
    ['Gurukula College Kelaniya', 'Western', 'Gampaha', 'National'],
    ['Veyangoda Central College', 'Western', 'Gampaha', 'National'],
    ['Bandaranayake Central College Veyangoda', 'Western', 'Gampaha', 'National'],
    ['Al-Hilal Central College Negombo', 'Western', 'Gampaha', 'National'],
    ['Gothami Balika Vidyalaya Gampaha', 'Western', 'Gampaha', 'Provincial'],
    ['Galahitiyawa Central College Ganemulla', 'Western', 'Gampaha', 'National'],

    // Kalutara District
    ['Kalutara Vidyalaya', 'Western', 'Kalutara', 'National'],
    ['Kalutara Balika Vidyalaya', 'Western', 'Kalutara', 'National'],
    ['Tissa Central College Kalutara', 'Western', 'Kalutara', 'National'],
    ['Taxila Central College Horana', 'Western', 'Kalutara', 'National'],
    ['Sri Palee College Horana', 'Western', 'Kalutara', 'National'],
    ['C.W.W. Kannangara Central College Mathugama', 'Western', 'Kalutara', 'National'],
    ['Ananda Sastralaya Matugama', 'Western', 'Kalutara', 'National'],
    ['Miriswatta National School', 'Western', 'Kalutara', 'National'],
    ['Wadduwa Central College', 'Western', 'Kalutara', 'National'],
    ['Al-Humaisara National School Beruwala', 'Western', 'Kalutara', 'National'],
    ['Zahira College Dharga Town', 'Western', 'Kalutara', 'National'],
    ['Sri Sumangala College Panadura', 'Western', 'Kalutara', 'National'],
    ['Sri Sumangala Balika Vidyalaya Panadura', 'Western', 'Kalutara', 'National'],

    // ── Central Province ───────────────────────────────────────
    // Kandy District
    ['Dharmaraja College', 'Central', 'Kandy', 'National'],
    ['Kingswood College', 'Central', 'Kandy', 'National'],
    ['Trinity College', 'Central', 'Kandy', 'National'],
    ["St. Anthony's College Kandy", 'Central', 'Kandy', 'National'],
    ['Vidyartha College', 'Central', 'Kandy', 'National'],
    ['Sri Rahula College Katugastota', 'Central', 'Kandy', 'National'],
    ["Mahamaya Girls' College", 'Central', 'Kandy', 'National'],
    ['Girls High School Kandy', 'Central', 'Kandy', 'National'],
    ["Pushpadana Girls' College", 'Central', 'Kandy', 'National'],
    ["St. Anthony's Girls' College Kandy", 'Central', 'Kandy', 'National'],
    ['Vihara Maha Devi Balika Vidyalaya Kandy', 'Central', 'Kandy', 'National'],
    ['Kandy Maha Vidyalaya', 'Central', 'Kandy', 'Provincial'],
    ['Nugawela Central College', 'Central', 'Kandy', 'National'],
    ['Al-Manar National School Galhinna', 'Central', 'Kandy', 'National'],
    ['Zahira College Gampola', 'Central', 'Kandy', 'National'],
    ['Wickramabahu National School Gampola', 'Central', 'Kandy', 'National'],
    ['Badi-ud-din Mahmud Girls College Kandy', 'Central', 'Kandy', 'National'],
    ['Peradeniya Central College', 'Central', 'Kandy', 'National'],
    ['Sri Sumangala College Kandy', 'Central', 'Kandy', 'National'],

    // Matale District
    ["St. Thomas' College Matale", 'Central', 'Matale', 'National'],
    ['Vijaya College Matale', 'Central', 'Matale', 'National'],
    ['Sri Sangamitta Balika National School Matale', 'Central', 'Matale', 'National'],
    ['Zahira College Matale', 'Central', 'Matale', 'National'],
    ['Christ Church College Matale', 'Central', 'Matale', 'National'],
    ['Rangiri Dambulla National School', 'Central', 'Matale', 'National'],
    ['Government Science College Matale', 'Central', 'Matale', 'National'],

    // Nuwara Eliya District
    ['Gamini National School Nuwara Eliya', 'Central', 'Nuwara Eliya', 'National'],
    ['Poramadulla Central College Rikillagaskada', 'Central', 'Nuwara Eliya', 'National'],
    ["St. Xavier's College Nuwara Eliya", 'Central', 'Nuwara Eliya', 'National'],
    ['Good Shepherd Convent Nuwara Eliya', 'Central', 'Nuwara Eliya', 'National'],
    ['Highlands Central College Hatton', 'Central', 'Nuwara Eliya', 'National'],
    ["St. Gabriel's Girls' College Hatton", 'Central', 'Nuwara Eliya', 'National'],
    ['Ginigathena Central College', 'Central', 'Nuwara Eliya', 'National'],

    // ── Southern Province ──────────────────────────────────────
    // Galle District
    ['Richmond College', 'Southern', 'Galle', 'National'],
    ['Mahinda College', 'Southern', 'Galle', 'National'],
    ["St. Aloysius' College Galle", 'Southern', 'Galle', 'National'],
    ['Vidyaloka College Galle', 'Southern', 'Galle', 'National'],
    ['Southlands College Galle', 'Southern', 'Galle', 'National'],
    ['Sanghamitta Balika Vidyalaya Galle', 'Southern', 'Galle', 'National'],
    ["Ripon Girls' School Galle", 'Southern', 'Galle', 'National'],
    ['Nagoda Royal National College', 'Southern', 'Galle', 'National'],
    ['Ananda Central College Elpitiya', 'Southern', 'Galle', 'National'],
    ['Devapathiraja National School Rathgama', 'Southern', 'Galle', 'National'],
    ['Sri Sumangala Central College Hikkaduwa', 'Southern', 'Galle', 'National'],
    ['Bonavista College Galle', 'Southern', 'Galle', 'Provincial'],

    // Matara District
    ['Rahula College Matara', 'Southern', 'Matara', 'National'],
    ["St. Servatius' College Matara", 'Southern', 'Matara', 'National'],
    ["St. Thomas' College Matara", 'Southern', 'Matara', 'National'],
    ['Sujatha Vidyalaya Matara', 'Southern', 'Matara', 'National'],
    ["St. Thomas' Girls' High School Matara", 'Southern', 'Matara', 'National'],
    ['Telijjawila Central College', 'Southern', 'Matara', 'National'],
    ['Vijitha Central College Dikwella', 'Southern', 'Matara', 'National'],
    ['Dickwella Kumaratunga Munidasa Maha Vidyalaya', 'Southern', 'Matara', 'National'],
    ['Anura Vidyalaya Matara', 'Southern', 'Matara', 'National'],
    ['Siddhartha College Weligama', 'Southern', 'Matara', 'National'],

    // Hambantota District
    ['Ruhunu Vijayaba National School Tangalle', 'Southern', 'Hambantota', 'National'],
    ["Tangalle Boys' School", 'Southern', 'Hambantota', 'National'],
    ["Tangalle Girls' School", 'Southern', 'Hambantota', 'National'],
    ['Debarawewa Central College Tissamaharama', 'Southern', 'Hambantota', 'National'],
    ['Tissamaharama Maha Vidyalaya', 'Southern', 'Hambantota', 'National'],
    ['Zahira National College Hambantota', 'Southern', 'Hambantota', 'National'],
    ['Hambantota Roman Catholic Vidyalaya', 'Southern', 'Hambantota', 'Provincial'],
    ['Ambalantota Maha Vidyalaya', 'Southern', 'Hambantota', 'National'],

    // ── Northern Province ──────────────────────────────────────
    // Jaffna District
    ['Jaffna Central College', 'Northern', 'Jaffna', 'National'],
    ['Jaffna Hindu College', 'Northern', 'Jaffna', 'National'],
    ["St. John's College Jaffna", 'Northern', 'Jaffna', 'National'],
    ["St. Patrick's College Jaffna", 'Northern', 'Jaffna', 'National'],
    ['Hartley College Point Pedro', 'Northern', 'Jaffna', 'National'],
    ['Vembadi Girls High School Jaffna', 'Northern', 'Jaffna', 'National'],
    ['Chundikuli Girls College Jaffna', 'Northern', 'Jaffna', 'National'],
    ['Union College Tellippalai', 'Northern', 'Jaffna', 'National'],
    ['Mahajana College Tellippalai', 'Northern', 'Jaffna', 'National'],
    ['Skandavarodaya College Chunnakam', 'Northern', 'Jaffna', 'National'],
    ['Methodist Girls High School Point Pedro', 'Northern', 'Jaffna', 'National'],
    ['Kokuvil Hindu College', 'Northern', 'Jaffna', 'National'],

    // Kilinochchi District
    ['Kilinochchi Central College', 'Northern', 'Kilinochchi', 'National'],
    ['Kilinochchi Maha Vidyalayam', 'Northern', 'Kilinochchi', 'National'],
    ['Uruthirapuram Maha Vidyalayam', 'Northern', 'Kilinochchi', 'Provincial'],

    // Mannar District
    ["St. Xavier's Boys' College Mannar", 'Northern', 'Mannar', 'National'],
    ["St. Xavier's Girls' College Mannar", 'Northern', 'Mannar', 'National'],
    ['Mannar Sithyvinayagar Hindu College', 'Northern', 'Mannar', 'National'],

    // Vavuniya District
    ['Vavuniya Tamil Maha Vidyalayam', 'Northern', 'Vavuniya', 'National'],
    ['Rambaikulam Girls Maha Vidyalayam', 'Northern', 'Vavuniya', 'National'],
    ['Vavuniya Muslim Maha Vidyalayam', 'Northern', 'Vavuniya', 'National'],
    ['Gamini Maha Vidyalaya Vavuniya', 'Northern', 'Vavuniya', 'National'],

    // Mullaitivu District
    ['Mullaitivu Maha Vidyalayam', 'Northern', 'Mullaitivu', 'National'],
    ['Vidyananda College Mulliyawalai', 'Northern', 'Mullaitivu', 'National'],

    // ── North Western Province ─────────────────────────────────
    // Kurunegala District
    ['Maliyadeva College Kurunegala', 'North Western', 'Kurunegala', 'National'],
    ['Maliyadeva Balika Vidyalaya Kurunegala', 'North Western', 'Kurunegala', 'National'],
    ["St. Anne's College Kurunegala", 'North Western', 'Kurunegala', 'National'],
    ['Holy Family Convent Kurunegala', 'North Western', 'Kurunegala', 'National'],
    ['Ibbagamuwa Central College', 'North Western', 'Kurunegala', 'National'],
    ['Kuliyapitiya Central College', 'North Western', 'Kurunegala', 'National'],
    ['Wayamba Royal College Kurunegala', 'North Western', 'Kurunegala', 'National'],
    ['Wickramashila Central College Giriulla', 'North Western', 'Kurunegala', 'National'],
    ['Mayurapada Central College Narammala', 'North Western', 'Kurunegala', 'National'],
    ['S.B. Herath National School Ganewatta', 'North Western', 'Kurunegala', 'National'],
    ['Pannala National School', 'North Western', 'Kurunegala', 'National'],

    // Puttalam District
    ['Joseph Vaz College Wennappuwa', 'North Western', 'Puttalam', 'National'],
    ['Holy Family Convent Wennappuwa', 'North Western', 'Puttalam', 'National'],
    ['Dhammissara National School Nattandiya', 'North Western', 'Puttalam', 'National'],
    ['Ananda National School Chilaw', 'North Western', 'Puttalam', 'National'],
    ["St. Mary's Boys' College Chilaw", 'North Western', 'Puttalam', 'National'],
    ['Carmel Girls College Chilaw', 'North Western', 'Puttalam', 'National'],
    ['Fathima Muslim Ladies College Puttalam', 'North Western', 'Puttalam', 'National'],
    ['Zahira National College Puttalam', 'North Western', 'Puttalam', 'National'],
    ['Senanayake National School Madampe', 'North Western', 'Puttalam', 'National'],

    // ── North Central Province ─────────────────────────────────
    // Anuradhapura District
    ['Central College Anuradhapura', 'North Central', 'Anuradhapura', 'National'],
    ['Walisinghe Harischandra Maha Vidyalaya', 'North Central', 'Anuradhapura', 'National'],
    ["St. Joseph's College Anuradhapura", 'North Central', 'Anuradhapura', 'National'],
    ['Swarnapali Balika National College Anuradhapura', 'North Central', 'Anuradhapura', 'National'],
    ['Kebithigollewa National School', 'North Central', 'Anuradhapura', 'National'],
    ['Thambuttegama Central College', 'North Central', 'Anuradhapura', 'National'],
    ['Medawachchiya Maithripala Senanayake Central College', 'North Central', 'Anuradhapura', 'National'],
    ['Kekirawa Central College', 'North Central', 'Anuradhapura', 'National'],

    // Polonnaruwa District
    ['Royal Central College Polonnaruwa', 'North Central', 'Polonnaruwa', 'National'],
    ['Topawewa Maha Vidyalaya Polonnaruwa', 'North Central', 'Polonnaruwa', 'National'],
    ['Medirigiriya National School', 'North Central', 'Polonnaruwa', 'National'],
    ['Sewamuktha Kandura Navodya Maha Vidyalaya', 'North Central', 'Polonnaruwa', 'National'],
    ['Minneriya National School', 'North Central', 'Polonnaruwa', 'National'],
    ['Manampitiya Sinhala Maha Vidyalaya', 'North Central', 'Polonnaruwa', 'Provincial'],

    // ── Uva Province ───────────────────────────────────────────
    // Badulla District
    ['Badulla Central College', 'Uva', 'Badulla', 'National'],
    ['Dharmaduta College Badulla', 'Uva', 'Badulla', 'National'],
    ['Uva College Badulla', 'Uva', 'Badulla', 'National'],
    ['Viharamahadevi Girls College Badulla', 'Uva', 'Badulla', 'National'],
    ['Visakha Girls High School Badulla', 'Uva', 'Badulla', 'National'],
    ['Bandarawela Central College', 'Uva', 'Badulla', 'National'],
    ["St. Thomas' College Bandarawela", 'Uva', 'Badulla', 'National'],
    ['Visakha Vidyalaya Bandarawela', 'Uva', 'Badulla', 'National'],
    ['Welimada Central College', 'Uva', 'Badulla', 'National'],
    ['Mahiyangana National School', 'Uva', 'Badulla', 'National'],
    ['Al-Adhan Central College Badulla', 'Uva', 'Badulla', 'National'],

    // Monaragala District
    ['Mahanama National College Monaragala', 'Uva', 'Monaragala', 'National'],
    ['Royal College Monaragala', 'Uva', 'Monaragala', 'National'],
    ['Wellawaya National School', 'Uva', 'Monaragala', 'National'],
    ['Bibile Central College', 'Uva', 'Monaragala', 'National'],
    ['Medagama National School', 'Uva', 'Monaragala', 'National'],
    ['Buttala Dutugemunu Central College', 'Uva', 'Monaragala', 'National'],

    // ── Sabaragamuwa Province ──────────────────────────────────
    // Ratnapura District
    ['Sivali Central College Ratnapura', 'Sabaragamuwa', 'Ratnapura', 'National'],
    ['Ferguson High School Ratnapura', 'Sabaragamuwa', 'Ratnapura', 'National'],
    ["St. Aloysius' National College Ratnapura", 'Sabaragamuwa', 'Ratnapura', 'National'],
    ['Sumana Balika Vidyalaya Ratnapura', 'Sabaragamuwa', 'Ratnapura', 'National'],
    ['Kularatna Central College Godakawela', 'Sabaragamuwa', 'Ratnapura', 'National'],
    ['Ananda Maithreya Central College Balangoda', 'Sabaragamuwa', 'Ratnapura', 'National'],
    ['Balangoda Central College', 'Sabaragamuwa', 'Ratnapura', 'National'],
    ["President's College Embilipitiya", 'Sabaragamuwa', 'Ratnapura', 'National'],
    ['Rahula National School Godakawela', 'Sabaragamuwa', 'Ratnapura', 'National'],

    // Kegalle District
    ['Kegalu Vidyalaya', 'Sabaragamuwa', 'Kegalle', 'National'],
    ['Kegalu Balika Vidyalaya', 'Sabaragamuwa', 'Kegalle', 'National'],
    ["St. Joseph's Balika Vidyalaya Kegalle", 'Sabaragamuwa', 'Kegalle', 'National'],
    ["St. Mary's College Kegalle", 'Sabaragamuwa', 'Kegalle', 'National'],
    ['Dudley Senanayake Central College Tholangamuwa', 'Sabaragamuwa', 'Kegalle', 'National'],
    ['Mayurapada Central College Mawanella', 'Sabaragamuwa', 'Kegalle', 'National'],
    ['Zahira National College Mawanella', 'Sabaragamuwa', 'Kegalle', 'National'],
    ['Dehiowita National School', 'Sabaragamuwa', 'Kegalle', 'National'],
    ['Ruwanwella Rajasinghe Central College', 'Sabaragamuwa', 'Kegalle', 'National'],

    // ── Eastern Province ───────────────────────────────────────
    // Trincomalee District
    ["St. Joseph's College Trincomalee", 'Eastern', 'Trincomalee', 'National'],
    ['Sri Koneswara Hindu College Trincomalee', 'Eastern', 'Trincomalee', 'National'],
    ["St. Mary's College Trincomalee", 'Eastern', 'Trincomalee', 'National'],
    ['Orrs Hill Vivekananda College', 'Eastern', 'Trincomalee', 'National'],
    ['Trincomalee Girls High School', 'Eastern', 'Trincomalee', 'National'],
    ['Kinniya Central College', 'Eastern', 'Trincomalee', 'National'],
    ['Mutur Central College', 'Eastern', 'Trincomalee', 'National'],
    ['Kantale Central College', 'Eastern', 'Trincomalee', 'National'],

    // Batticaloa District
    ["St. Michael's College Batticaloa", 'Eastern', 'Batticaloa', 'National'],
    ['Vincent Girls High School Batticaloa', 'Eastern', 'Batticaloa', 'National'],
    ['Shivananda National School Batticaloa', 'Eastern', 'Batticaloa', 'National'],
    ['Methodist Central College Batticaloa', 'Eastern', 'Batticaloa', 'National'],
    ['Al-Adhan Maha Vidyalaya Batticaloa', 'Eastern', 'Batticaloa', 'National'],
    ['Valachchenai An-Noor Maha Vidyalaya', 'Eastern', 'Batticaloa', 'National'],

    // Ampara District
    ['D.S. Senanayake National College Ampara', 'Eastern', 'Ampara', 'National'],
    ['Bandaranayake Balika Vidyalaya Ampara', 'Eastern', 'Ampara', 'National'],
    ['Zahira College Kalmunai', 'Eastern', 'Ampara', 'National'],
    ['Carmel Fatima College Kalmunai', 'Eastern', 'Ampara', 'National'],
    ['Wesley High School Kalmunai', 'Eastern', 'Ampara', 'National'],
    ['Mahmud Ladies College Kalmunai', 'Eastern', 'Ampara', 'National'],
    ['Al-Ashraq National School Nintavur', 'Eastern', 'Ampara', 'National'],
    ['Akkaraipattu Muslim Central College', 'Eastern', 'Ampara', 'National'],
    ['Dehiattakandiya National School', 'Eastern', 'Ampara', 'National']
];

$stmt = $conn->prepare("INSERT INTO schools (name, province, district, type) 
                        SELECT ?, ?, ?, ? 
                        WHERE NOT EXISTS (SELECT 1 FROM schools WHERE name = ?)");

$added = 0;
$skipped = 0;

foreach ($schools as $s) {
    $name = $s[0];
    $province = $s[1];
    $district = $s[2];
    $type = $s[3];
    
    $stmt->bind_param('sssss', $name, $province, $district, $type, $name);
    $stmt->execute();
    
    if ($stmt->affected_rows > 0) {
        $added++;
    } else {
        $skipped++;
    }
}

echo "Schools added: $added\n";
echo "Schools already existing / skipped: $skipped\n";

$res = $conn->query("SELECT COUNT(*) as total FROM schools");
$row = $res->fetch_assoc();
echo "Total schools now in database: " . $row['total'] . "\n";

