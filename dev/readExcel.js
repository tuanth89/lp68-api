const mongoose = require('mongoose');
const config = require('../config');
const Province = require('../src/models/province');
const District = require('../src/models/district');
const _ = require('lodash');

const Q = require("q");
const errors = require('restify-errors');

// const ProvinceRepository = require('../src/repository/provinceRepository');
// var parseExcel = require('node-xlsx');

// establish connection to mongodb
mongoose.Promise = global.Promise;
mongoose.connect(config.db.uri, {auth: config.db.auth});

const db = mongoose.connection;

db.on('error', (err) => {
    console.error(err);
    // process.exit(1);
});

db.once('open', () => {
    let provinceArr = [
        {
            "provinceId": "1",
            "name": "Hà Nội",
            "type": "Thành Phố",
            "unsignName": "ha noi"
        },
        {
            "provinceId": "2",
            "name": "Hà Giang",
            "type": "Tỉnh",
            "unsignName": "ha giang"
        },
        {
            "provinceId": "4",
            "name": "Cao Bằng",
            "type": "Tỉnh",
            "unsignName": "cao bang"
        },
        {
            "provinceId": "6",
            "name": "Bắc Kạn",
            "type": "Tỉnh",
            "unsignName": "bac kan"
        },
        {
            "provinceId": "8",
            "name": "Tuyên Quang",
            "type": "Tỉnh",
            "unsignName": "tuyen quang"
        },
        {
            "provinceId": "10",
            "name": "Lào Cai",
            "type": "Tỉnh",
            "unsignName": "lao cai"
        },
        {
            "provinceId": "11",
            "name": "Điện Biên",
            "type": "Tỉnh",
            "unsignName": "dien bien"
        },
        {
            "provinceId": "12",
            "name": "Lai Châu",
            "type": "Tỉnh",
            "unsignName": "lai chau"
        },
        {
            "provinceId": "14",
            "name": "Sơn La",
            "type": "Tỉnh",
            "unsignName": "son la"
        },
        {
            "provinceId": "15",
            "name": "Yên Bái",
            "type": "Tỉnh",
            "unsignName": "yen bai"
        },
        {
            "provinceId": "17",
            "name": "Hòa Bình",
            "type": "Tỉnh",
            "unsignName": "hoa binh"
        },
        {
            "provinceId": "19",
            "name": "Thái Nguyên",
            "type": "Tỉnh",
            "unsignName": "thai nguyen"
        },
        {
            "provinceId": "20",
            "name": "Lạng Sơn",
            "type": "Tỉnh",
            "unsignName": "lang son"
        },
        {
            "provinceId": "22",
            "name": "Quảng Ninh",
            "type": "Tỉnh",
            "unsignName": "quang ninh"
        },
        {
            "provinceId": "24",
            "name": "Bắc Giang",
            "type": "Tỉnh",
            "unsignName": "bac giang"
        },
        {
            "provinceId": "25",
            "name": "Phú Thọ",
            "type": "Tỉnh",
            "unsignName": "phu tho"
        },
        {
            "provinceId": "26",
            "name": "Vĩnh Phúc",
            "type": "Tỉnh",
            "unsignName": "vinh phuc"
        },
        {
            "provinceId": "27",
            "name": "Bắc Ninh",
            "type": "Tỉnh",
            "unsignName": "bac ninh"
        },
        {
            "provinceId": "30",
            "name": "Hải Dương",
            "type": "Tỉnh",
            "unsignName": "hai duong"
        },
        {
            "provinceId": "31",
            "name": "Hải Phòng",
            "type": "Thành Phố",
            "unsignName": "hai phong"
        },
        {
            "provinceId": "33",
            "name": "Hưng Yên",
            "type": "Tỉnh",
            "unsignName": "hung yen"
        },
        {
            "provinceId": "34",
            "name": "Thái Bình",
            "type": "Tỉnh",
            "unsignName": "thai binh"
        },
        {
            "provinceId": "35",
            "name": "Hà Nam",
            "type": "Tỉnh",
            "unsignName": "ha nam"
        },
        {
            "provinceId": "36",
            "name": "Nam Định",
            "type": "Tỉnh",
            "unsignName": "nam dinh"
        },
        {
            "provinceId": "37",
            "name": "Ninh Bình",
            "type": "Tỉnh",
            "unsignName": "ninh binh"
        },
        {
            "provinceId": "38",
            "name": "Thanh Hóa",
            "type": "Tỉnh",
            "unsignName": "thanh hoa"
        },
        {
            "provinceId": "40",
            "name": "Nghệ An",
            "type": "Tỉnh",
            "unsignName": "nghe an"
        },
        {
            "provinceId": "42",
            "name": "Hà Tĩnh",
            "type": "Tỉnh",
            "unsignName": "ha tinh"
        },
        {
            "provinceId": "44",
            "name": "Quảng Bình",
            "type": "Tỉnh",
            "unsignName": "quang binh"
        },
        {
            "provinceId": "45",
            "name": "Quảng Trị",
            "type": "Tỉnh",
            "unsignName": "quang tri"
        },
        {
            "provinceId": "46",
            "name": "Thừa Thiên Huế",
            "type": "Tỉnh",
            "unsignName": "thua thien hue"
        },
        {
            "provinceId": "48",
            "name": "Đà Nẵng",
            "type": "Thành Phố",
            "unsignName": "da nang"
        },
        {
            "provinceId": "49",
            "name": "Quảng Nam",
            "type": "Tỉnh",
            "unsignName": "quang nam"
        },
        {
            "provinceId": "51",
            "name": "Quảng Ngãi",
            "type": "Tỉnh",
            "unsignName": "quang ngai"
        },
        {
            "provinceId": "52",
            "name": "Bình Định",
            "type": "Tỉnh",
            "unsignName": "binh dinh"
        },
        {
            "provinceId": "54",
            "name": "Phú Yên",
            "type": "Tỉnh",
            "unsignName": "phu yen"
        },
        {
            "provinceId": "56",
            "name": "Khánh Hòa",
            "type": "Tỉnh",
            "unsignName": "khanh hoa"
        },
        {
            "provinceId": "58",
            "name": "Ninh Thuận",
            "type": "Tỉnh",
            "unsignName": "ninh thuan"
        },
        {
            "provinceId": "60",
            "name": "Bình Thuận",
            "type": "Tỉnh",
            "unsignName": "binh thuan"
        },
        {
            "provinceId": "62",
            "name": "Kon Tum",
            "type": "Tỉnh",
            "unsignName": "kon tum"
        },
        {
            "provinceId": "64",
            "name": "Gia Lai",
            "type": "Tỉnh",
            "unsignName": "gia lai"
        },
        {
            "provinceId": "66",
            "name": "Đắk Lắk",
            "type": "Tỉnh",
            "unsignName": "dak lak"
        },
        {
            "provinceId": "67",
            "name": "Đắk Nông",
            "type": "Tỉnh",
            "unsignName": "dak nong"
        },
        {
            "provinceId": "68",
            "name": "Lâm Đồng",
            "type": "Tỉnh",
            "unsignName": "lam dong"
        },
        {
            "provinceId": "70",
            "name": "Bình Phước",
            "type": "Tỉnh",
            "unsignName": "binh phuoc"
        },
        {
            "provinceId": "72",
            "name": "Tây Ninh",
            "type": "Tỉnh",
            "unsignName": "tay ninh"
        },
        {
            "provinceId": "74",
            "name": "Bình Dương",
            "type": "Tỉnh",
            "unsignName": "binh duong"
        },
        {
            "provinceId": "75",
            "name": "Đồng Nai",
            "type": "Tỉnh",
            "unsignName": "dong nai"
        },
        {
            "provinceId": "77",
            "name": "Bà Rịa - Vũng Tàu",
            "type": "Tỉnh",
            "unsignName": "ba ria - vung tau"
        },
        {
            "provinceId": "79",
            "name": "Hồ Chí Minh",
            "type": "Thành Phố",
            "unsignName": "ho chi minh"
        },
        {
            "provinceId": "80",
            "name": "Long An",
            "type": "Tỉnh",
            "unsignName": "long an"
        },
        {
            "provinceId": "82",
            "name": "Tiền Giang",
            "type": "Tỉnh",
            "unsignName": "tien giang"
        },
        {
            "provinceId": "83",
            "name": "Bến Tre",
            "type": "Tỉnh",
            "unsignName": "ben tre"
        },
        {
            "provinceId": "84",
            "name": "Trà Vinh",
            "type": "Tỉnh",
            "unsignName": "tra vinh"
        },
        {
            "provinceId": "86",
            "name": "Vĩnh Long",
            "type": "Tỉnh",
            "unsignName": "vinh long"
        },
        {
            "provinceId": "87",
            "name": "Đồng Tháp",
            "type": "Tỉnh",
            "unsignName": "dong thap"
        },
        {
            "provinceId": "89",
            "name": "An Giang",
            "type": "Tỉnh",
            "unsignName": "an giang"
        },
        {
            "provinceId": "91",
            "name": "Kiên Giang",
            "type": "Tỉnh",
            "unsignName": "kien giang"
        },
        {
            "provinceId": "92",
            "name": "Cần Thơ",
            "type": "Thành Phố",
            "unsignName": "can tho"
        },
        {
            "provinceId": "93",
            "name": "Hậu Giang",
            "type": "Tỉnh",
            "unsignName": "hau giang"
        },
        {
            "provinceId": "94",
            "name": "Sóc Trăng",
            "type": "Tỉnh",
            "unsignName": "soc trang"
        },
        {
            "provinceId": "95",
            "name": "Bạc Liêu",
            "type": "Tỉnh",
            "unsignName": "bac lieu"
        },
        {
            "provinceId": "96",
            "name": "Cà Mau",
            "type": "Tỉnh",
            "unsignName": "ca mau"
        },
        {
            "provinceId": ""
        }
    ];

    let districtArr = [
        {
            "name": "Ba Đình",
            "type": "Quận",
            "provinceId": "1",
            "usignName": "ba dinh"
        },
        {
            "name": "Hoàn Kiếm",
            "type": "Quận",
            "provinceId": "1",
            "usignName": "hoan kiem"
        },
        {
            "name": "Tây Hồ",
            "type": "Quận",
            "provinceId": "1",
            "usignName": "tay ho"
        },
        {
            "name": "Long Biên",
            "type": "Quận",
            "provinceId": "1",
            "usignName": "long bien"
        },
        {
            "name": "Cầu Giấy",
            "type": "Quận",
            "provinceId": "1",
            "usignName": "cau giay"
        },
        {
            "name": "Đống Đa",
            "type": "Quận",
            "provinceId": "1",
            "usignName": "dong da"
        },
        {
            "name": "Hai Bà Trưng",
            "type": "Quận",
            "provinceId": "1",
            "usignName": "hai ba trung"
        },
        {
            "name": "Hoàng Mai",
            "type": "Quận",
            "provinceId": "1",
            "usignName": "hoang mai"
        },
        {
            "name": "Thanh Xuân",
            "type": "Quận",
            "provinceId": "1",
            "usignName": "thanh xuan"
        },
        {
            "name": "Sóc Sơn",
            "type": "Huyện",
            "provinceId": "1",
            "usignName": "soc son"
        },
        {
            "name": "Đông Anh",
            "type": "Huyện",
            "provinceId": "1",
            "usignName": "dong anh"
        },
        {
            "name": "Gia Lâm",
            "type": "Huyện",
            "provinceId": "1",
            "usignName": "gia lam"
        },
        {
            "name": "Từ Liêm",
            "type": "Huyện",
            "provinceId": "1",
            "usignName": "tu liem"
        },
        {
            "name": "Thanh Trì",
            "type": "Huyện",
            "provinceId": "1",
            "usignName": "thanh tri"
        },
        {
            "name": "Hà Giang",
            "type": "Thị Xã",
            "provinceId": "2",
            "usignName": "ha giang"
        },
        {
            "name": "Đồng Văn",
            "type": "Huyện",
            "provinceId": "2",
            "usignName": "dong van"
        },
        {
            "name": "Mèo Vạc",
            "type": "Huyện",
            "provinceId": "2",
            "usignName": "meo vac"
        },
        {
            "name": "Yên Minh",
            "type": "Huyện",
            "provinceId": "2",
            "usignName": "yen minh"
        },
        {
            "name": "Quản Bạ",
            "type": "Huyện",
            "provinceId": "2",
            "usignName": "quan ba"
        },
        {
            "name": "Vị Xuyên",
            "type": "Huyện",
            "provinceId": "2",
            "usignName": "vi xuyen"
        },
        {
            "name": "Bắc Mê",
            "type": "Huyện",
            "provinceId": "2",
            "usignName": "bac me"
        },
        {
            "name": "Hoàng Su Phì",
            "type": "Huyện",
            "provinceId": "2",
            "usignName": "hoang su phi"
        },
        {
            "name": "Xín Mần",
            "type": "Huyện",
            "provinceId": "2",
            "usignName": "xin man"
        },
        {
            "name": "Bắc Quang",
            "type": "Huyện",
            "provinceId": "2",
            "usignName": "bac quang"
        },
        {
            "name": "Quang Bình",
            "type": "Huyện",
            "provinceId": "2",
            "usignName": "quang binh"
        },
        {
            "name": "Cao Bằng",
            "type": "Thị Xã",
            "provinceId": "4",
            "usignName": "cao bang"
        },
        {
            "name": "Bảo Lâm",
            "type": "Huyện",
            "provinceId": "4",
            "usignName": "bao lam"
        },
        {
            "name": "Bảo Lạc",
            "type": "Huyện",
            "provinceId": "4",
            "usignName": "bao lac"
        },
        {
            "name": "Thông Nông",
            "type": "Huyện",
            "provinceId": "4",
            "usignName": "thong nong"
        },
        {
            "name": "Hà Quảng",
            "type": "Huyện",
            "provinceId": "4",
            "usignName": "ha quang"
        },
        {
            "name": "Trà Lĩnh",
            "type": "Huyện",
            "provinceId": "4",
            "usignName": "tra linh"
        },
        {
            "name": "Trùng Khánh",
            "type": "Huyện",
            "provinceId": "4",
            "usignName": "trung khanh"
        },
        {
            "name": "Hạ Lang",
            "type": "Huyện",
            "provinceId": "4",
            "usignName": "ha lang"
        },
        {
            "name": "Quảng Uyên",
            "type": "Huyện",
            "provinceId": "4",
            "usignName": "quang uyen"
        },
        {
            "name": "Phục Hoà",
            "type": "Huyện",
            "provinceId": "4",
            "usignName": "phuc hoa"
        },
        {
            "name": "Hoà An",
            "type": "Huyện",
            "provinceId": "4",
            "usignName": "hoa an"
        },
        {
            "name": "Nguyên Bình",
            "type": "Huyện",
            "provinceId": "4",
            "usignName": "nguyen binh"
        },
        {
            "name": "Thạch An",
            "type": "Huyện",
            "provinceId": "4",
            "usignName": "thach an"
        },
        {
            "name": "Bắc Kạn",
            "type": "Thị Xã",
            "provinceId": "6",
            "usignName": "bac kan"
        },
        {
            "name": "Pác Nặm",
            "type": "Huyện",
            "provinceId": "6",
            "usignName": "pac nam"
        },
        {
            "name": "Ba Bể",
            "type": "Huyện",
            "provinceId": "6",
            "usignName": "ba be"
        },
        {
            "name": "Ngân Sơn",
            "type": "Huyện",
            "provinceId": "6",
            "usignName": "ngan son"
        },
        {
            "name": "Bạch Thông",
            "type": "Huyện",
            "provinceId": "6",
            "usignName": "bach thong"
        },
        {
            "name": "Chợ Đồn",
            "type": "Huyện",
            "provinceId": "6",
            "usignName": "cho don"
        },
        {
            "name": "Chợ Mới",
            "type": "Huyện",
            "provinceId": "6",
            "usignName": "cho moi"
        },
        {
            "name": "Na Rì",
            "type": "Huyện",
            "provinceId": "6",
            "usignName": "na ri"
        },
        {
            "name": "Tuyên Quang",
            "type": "Thị Xã",
            "provinceId": "8",
            "usignName": "tuyen quang"
        },
        {
            "name": "Nà Hang",
            "type": "Huyện",
            "provinceId": "8",
            "usignName": "na hang"
        },
        {
            "name": "Chiêm Hóa",
            "type": "Huyện",
            "provinceId": "8",
            "usignName": "chiem hoa"
        },
        {
            "name": "Hàm Yên",
            "type": "Huyện",
            "provinceId": "8",
            "usignName": "ham yen"
        },
        {
            "name": "Yên Sơn",
            "type": "Huyện",
            "provinceId": "8",
            "usignName": "yen son"
        },
        {
            "name": "Sơn Dương",
            "type": "Huyện",
            "provinceId": "8",
            "usignName": "son duong"
        },
        {
            "name": "Lào Cai",
            "type": "Thành Phố",
            "provinceId": "10",
            "usignName": "lao cai"
        },
        {
            "name": "Bát Xát",
            "type": "Huyện",
            "provinceId": "10",
            "usignName": "bat xat"
        },
        {
            "name": "Mường Khương",
            "type": "Huyện",
            "provinceId": "10",
            "usignName": "muong khuong"
        },
        {
            "name": "Si Ma Cai",
            "type": "Huyện",
            "provinceId": "10",
            "usignName": "si ma cai"
        },
        {
            "name": "Bắc Hà",
            "type": "Huyện",
            "provinceId": "10",
            "usignName": "bac ha"
        },
        {
            "name": "Bảo Thắng",
            "type": "Huyện",
            "provinceId": "10",
            "usignName": "bao thang"
        },
        {
            "name": "Bảo Yên",
            "type": "Huyện",
            "provinceId": "10",
            "usignName": "bao yen"
        },
        {
            "name": "Sa Pa",
            "type": "Huyện",
            "provinceId": "10",
            "usignName": "sa pa"
        },
        {
            "name": "Văn Bàn",
            "type": "Huyện",
            "provinceId": "10",
            "usignName": "van ban"
        },
        {
            "name": "Điện Biên Phủ",
            "type": "Thành Phố",
            "provinceId": "11",
            "usignName": "dien bien phu"
        },
        {
            "name": "Mường Lay",
            "type": "Thị Xã",
            "provinceId": "11",
            "usignName": "muong lay"
        },
        {
            "name": "Mường Nhé",
            "type": "Huyện",
            "provinceId": "11",
            "usignName": "muong nhe"
        },
        {
            "name": "Mường Chà",
            "type": "Huyện",
            "provinceId": "11",
            "usignName": "muong cha"
        },
        {
            "name": "Tủa Chùa",
            "type": "Huyện",
            "provinceId": "11",
            "usignName": "tua chua"
        },
        {
            "name": "Tuần Giáo",
            "type": "Huyện",
            "provinceId": "11",
            "usignName": "tuan giao"
        },
        {
            "name": "Điện Biên",
            "type": "Huyện",
            "provinceId": "11",
            "usignName": "dien bien"
        },
        {
            "name": "Điện Biên Đông",
            "type": "Huyện",
            "provinceId": "11",
            "usignName": "dien bien dong"
        },
        {
            "name": "Mường Ảng",
            "type": "Huyện",
            "provinceId": "11",
            "usignName": "muong ang"
        },
        {
            "name": "Lai Châu",
            "type": "Thị Xã",
            "provinceId": "12",
            "usignName": "lai chau"
        },
        {
            "name": "Tam Đường",
            "type": "Huyện",
            "provinceId": "12",
            "usignName": "tam duong"
        },
        {
            "name": "Mường Tè",
            "type": "Huyện",
            "provinceId": "12",
            "usignName": "muong te"
        },
        {
            "name": "Sìn Hồ",
            "type": "Huyện",
            "provinceId": "12",
            "usignName": "sin ho"
        },
        {
            "name": "Phong Thổ",
            "type": "Huyện",
            "provinceId": "12",
            "usignName": "phong tho"
        },
        {
            "name": "Than Uyên",
            "type": "Huyện",
            "provinceId": "12",
            "usignName": "than uyen"
        },
        {
            "name": "Tân Uyên",
            "type": "Huyện",
            "provinceId": "12",
            "usignName": "tan uyen"
        },
        {
            "name": "Sơn La",
            "type": "Thành Phố",
            "provinceId": "14",
            "usignName": "son la"
        },
        {
            "name": "Quỳnh Nhai",
            "type": "Huyện",
            "provinceId": "14",
            "usignName": "quynh nhai"
        },
        {
            "name": "Thuận Châu",
            "type": "Huyện",
            "provinceId": "14",
            "usignName": "thuan chau"
        },
        {
            "name": "Mường La",
            "type": "Huyện",
            "provinceId": "14",
            "usignName": "muong la"
        },
        {
            "name": "Bắc Yên",
            "type": "Huyện",
            "provinceId": "14",
            "usignName": "bac yen"
        },
        {
            "name": "Phù Yên",
            "type": "Huyện",
            "provinceId": "14",
            "usignName": "phu yen"
        },
        {
            "name": "Mộc Châu",
            "type": "Huyện",
            "provinceId": "14",
            "usignName": "moc chau"
        },
        {
            "name": "Yên Châu",
            "type": "Huyện",
            "provinceId": "14",
            "usignName": "yen chau"
        },
        {
            "name": "Mai Sơn",
            "type": "Huyện",
            "provinceId": "14",
            "usignName": "mai son"
        },
        {
            "name": "Sông Mã",
            "type": "Huyện",
            "provinceId": "14",
            "usignName": "song ma"
        },
        {
            "name": "Sốp Cộp",
            "type": "Huyện",
            "provinceId": "14",
            "usignName": "sop cop"
        },
        {
            "name": "Yên Bái",
            "type": "Thành Phố",
            "provinceId": "15",
            "usignName": "yen bai"
        },
        {
            "name": "Nghĩa Lộ",
            "type": "Thị Xã",
            "provinceId": "15",
            "usignName": "nghia lo"
        },
        {
            "name": "Lục Yên",
            "type": "Huyện",
            "provinceId": "15",
            "usignName": "luc yen"
        },
        {
            "name": "Văn Yên",
            "type": "Huyện",
            "provinceId": "15",
            "usignName": "van yen"
        },
        {
            "name": "Mù Cang Chải",
            "type": "Huyện",
            "provinceId": "15",
            "usignName": "mu cang chai"
        },
        {
            "name": "Trấn Yên",
            "type": "Huyện",
            "provinceId": "15",
            "usignName": "tran yen"
        },
        {
            "name": "Trạm Tấu",
            "type": "Huyện",
            "provinceId": "15",
            "usignName": "tram tau"
        },
        {
            "name": "Văn Chấn",
            "type": "Huyện",
            "provinceId": "15",
            "usignName": "van chan"
        },
        {
            "name": "Yên Bình",
            "type": "Huyện",
            "provinceId": "15",
            "usignName": "yen binh"
        },
        {
            "name": "Hòa Bình",
            "type": "Thành Phố",
            "provinceId": "17",
            "usignName": "hoa binh"
        },
        {
            "name": "Đà Bắc",
            "type": "Huyện",
            "provinceId": "17",
            "usignName": "da bac"
        },
        {
            "name": "Kỳ Sơn",
            "type": "Huyện",
            "provinceId": "17",
            "usignName": "ky son"
        },
        {
            "name": "Lương Sơn",
            "type": "Huyện",
            "provinceId": "17",
            "usignName": "luong son"
        },
        {
            "name": "Kim Bôi",
            "type": "Huyện",
            "provinceId": "17",
            "usignName": "kim boi"
        },
        {
            "name": "Cao Phong",
            "type": "Huyện",
            "provinceId": "17",
            "usignName": "cao phong"
        },
        {
            "name": "Tân Lạc",
            "type": "Huyện",
            "provinceId": "17",
            "usignName": "tan lac"
        },
        {
            "name": "Mai Châu",
            "type": "Huyện",
            "provinceId": "17",
            "usignName": "mai chau"
        },
        {
            "name": "Lạc Sơn",
            "type": "Huyện",
            "provinceId": "17",
            "usignName": "lac son"
        },
        {
            "name": "Yên Thủy",
            "type": "Huyện",
            "provinceId": "17",
            "usignName": "yen thuy"
        },
        {
            "name": "Lạc Thủy",
            "type": "Huyện",
            "provinceId": "17",
            "usignName": "lac thuy"
        },
        {
            "name": "Thái Nguyên",
            "type": "Thành Phố",
            "provinceId": "19",
            "usignName": "thai nguyen"
        },
        {
            "name": "Sông Công",
            "type": "Thị Xã",
            "provinceId": "19",
            "usignName": "song cong"
        },
        {
            "name": "Định Hóa",
            "type": "Huyện",
            "provinceId": "19",
            "usignName": "dinh hoa"
        },
        {
            "name": "Phú Lương",
            "type": "Huyện",
            "provinceId": "19",
            "usignName": "phu luong"
        },
        {
            "name": "Đồng Hỷ",
            "type": "Huyện",
            "provinceId": "19",
            "usignName": "dong hy"
        },
        {
            "name": "Võ Nhai",
            "type": "Huyện",
            "provinceId": "19",
            "usignName": "vo nhai"
        },
        {
            "name": "Đại Từ",
            "type": "Huyện",
            "provinceId": "19",
            "usignName": "dai tu"
        },
        {
            "name": "Phổ Yên",
            "type": "Huyện",
            "provinceId": "19",
            "usignName": "pho yen"
        },
        {
            "name": "Phú Bình",
            "type": "Huyện",
            "provinceId": "19",
            "usignName": "phu binh"
        },
        {
            "name": "Lạng Sơn",
            "type": "Thành Phố",
            "provinceId": "20",
            "usignName": "lang son"
        },
        {
            "name": "Tràng Định",
            "type": "Huyện",
            "provinceId": "20",
            "usignName": "trang dinh"
        },
        {
            "name": "Bình Gia",
            "type": "Huyện",
            "provinceId": "20",
            "usignName": "binh gia"
        },
        {
            "name": "Văn Lãng",
            "type": "Huyện",
            "provinceId": "20",
            "usignName": "van lang"
        },
        {
            "name": "Cao Lộc",
            "type": "Huyện",
            "provinceId": "20",
            "usignName": "cao loc"
        },
        {
            "name": "Văn Quan",
            "type": "Huyện",
            "provinceId": "20",
            "usignName": "van quan"
        },
        {
            "name": "Bắc Sơn",
            "type": "Huyện",
            "provinceId": "20",
            "usignName": "bac son"
        },
        {
            "name": "Hữu Lũng",
            "type": "Huyện",
            "provinceId": "20",
            "usignName": "huu lung"
        },
        {
            "name": "Chi Lăng",
            "type": "Huyện",
            "provinceId": "20",
            "usignName": "chi lang"
        },
        {
            "name": "Lộc Bình",
            "type": "Huyện",
            "provinceId": "20",
            "usignName": "loc binh"
        },
        {
            "name": "Đình Lập",
            "type": "Huyện",
            "provinceId": "20",
            "usignName": "dinh lap"
        },
        {
            "name": "Hạ Long",
            "type": "Thành Phố",
            "provinceId": "22",
            "usignName": "ha long"
        },
        {
            "name": "Móng Cái",
            "type": "Thành Phố",
            "provinceId": "22",
            "usignName": "mong cai"
        },
        {
            "name": "Cẩm Phả",
            "type": "Thị Xã",
            "provinceId": "22",
            "usignName": "cam pha"
        },
        {
            "name": "Uông Bí",
            "type": "Thị Xã",
            "provinceId": "22",
            "usignName": "uong bi"
        },
        {
            "name": "Bình Liêu",
            "type": "Huyện",
            "provinceId": "22",
            "usignName": "binh lieu"
        },
        {
            "name": "Tiên Yên",
            "type": "Huyện",
            "provinceId": "22",
            "usignName": "tien yen"
        },
        {
            "name": "Đầm Hà",
            "type": "Huyện",
            "provinceId": "22",
            "usignName": "dam ha"
        },
        {
            "name": "Hải Hà",
            "type": "Huyện",
            "provinceId": "22",
            "usignName": "hai ha"
        },
        {
            "name": "Ba Chẽ",
            "type": "Huyện",
            "provinceId": "22",
            "usignName": "ba che"
        },
        {
            "name": "Vân Đồn",
            "type": "Huyện",
            "provinceId": "22",
            "usignName": "van don"
        },
        {
            "name": "Hoành Bồ",
            "type": "Huyện",
            "provinceId": "22",
            "usignName": "hoanh bo"
        },
        {
            "name": "Đông Triều",
            "type": "Huyện",
            "provinceId": "22",
            "usignName": "dong trieu"
        },
        {
            "name": "Yên Hưng",
            "type": "Huyện",
            "provinceId": "22",
            "usignName": "yen hung"
        },
        {
            "name": "Cô Tô",
            "type": "Huyện",
            "provinceId": "22",
            "usignName": "co to"
        },
        {
            "name": "Bắc Giang",
            "type": "Thành Phố",
            "provinceId": "24",
            "usignName": "bac giang"
        },
        {
            "name": "Yên Thế",
            "type": "Huyện",
            "provinceId": "24",
            "usignName": "yen the"
        },
        {
            "name": "Tân Yên",
            "type": "Huyện",
            "provinceId": "24",
            "usignName": "tan yen"
        },
        {
            "name": "Lạng Giang",
            "type": "Huyện",
            "provinceId": "24",
            "usignName": "lang giang"
        },
        {
            "name": "Lục Nam",
            "type": "Huyện",
            "provinceId": "24",
            "usignName": "luc nam"
        },
        {
            "name": "Lục Ngạn",
            "type": "Huyện",
            "provinceId": "24",
            "usignName": "luc ngan"
        },
        {
            "name": "Sơn Động",
            "type": "Huyện",
            "provinceId": "24",
            "usignName": "son dong"
        },
        {
            "name": "Yên Dũng",
            "type": "Huyện",
            "provinceId": "24",
            "usignName": "yen dung"
        },
        {
            "name": "Việt Yên",
            "type": "Huyện",
            "provinceId": "24",
            "usignName": "viet yen"
        },
        {
            "name": "Hiệp Hòa",
            "type": "Huyện",
            "provinceId": "24",
            "usignName": "hiep hoa"
        },
        {
            "name": "Việt Trì",
            "type": "Thành Phố",
            "provinceId": "25",
            "usignName": "viet tri"
        },
        {
            "name": "Phú Thọ",
            "type": "Thị Xã",
            "provinceId": "25",
            "usignName": "phu tho"
        },
        {
            "name": "Đoan Hùng",
            "type": "Huyện",
            "provinceId": "25",
            "usignName": "doan hung"
        },
        {
            "name": "Hạ Hoà",
            "type": "Huyện",
            "provinceId": "25",
            "usignName": "ha hoa"
        },
        {
            "name": "Thanh Ba",
            "type": "Huyện",
            "provinceId": "25",
            "usignName": "thanh ba"
        },
        {
            "name": "Phù Ninh",
            "type": "Huyện",
            "provinceId": "25",
            "usignName": "phu ninh"
        },
        {
            "name": "Yên Lập",
            "type": "Huyện",
            "provinceId": "25",
            "usignName": "yen lap"
        },
        {
            "name": "Cẩm Khê",
            "type": "Huyện",
            "provinceId": "25",
            "usignName": "cam khe"
        },
        {
            "name": "Tam Nông",
            "type": "Huyện",
            "provinceId": "25",
            "usignName": "tam nong"
        },
        {
            "name": "Lâm Thao",
            "type": "Huyện",
            "provinceId": "25",
            "usignName": "lam thao"
        },
        {
            "name": "Thanh Sơn",
            "type": "Huyện",
            "provinceId": "25",
            "usignName": "thanh son"
        },
        {
            "name": "Thanh Thuỷ",
            "type": "Huyện",
            "provinceId": "25",
            "usignName": "thanh thuy"
        },
        {
            "name": "Tân Sơn",
            "type": "Huyện",
            "provinceId": "25",
            "usignName": "tan son"
        },
        {
            "name": "Vĩnh Yên",
            "type": "Thành Phố",
            "provinceId": "26",
            "usignName": "vinh yen"
        },
        {
            "name": "Phúc Yên",
            "type": "Thị Xã",
            "provinceId": "26",
            "usignName": "phuc yen"
        },
        {
            "name": "Lập Thạch",
            "type": "Huyện",
            "provinceId": "26",
            "usignName": "lap thach"
        },
        {
            "name": "Tam Dương",
            "type": "Huyện",
            "provinceId": "26",
            "usignName": "tam duong"
        },
        {
            "name": "Tam Đảo",
            "type": "Huyện",
            "provinceId": "26",
            "usignName": "tam dao"
        },
        {
            "name": "Bình Xuyên",
            "type": "Huyện",
            "provinceId": "26",
            "usignName": "binh xuyen"
        },
        {
            "name": "Mê Linh",
            "type": "Huyện",
            "provinceId": "1",
            "usignName": "me linh"
        },
        {
            "name": "Yên Lạc",
            "type": "Huyện",
            "provinceId": "26",
            "usignName": "yen lac"
        },
        {
            "name": "Vĩnh Tường",
            "type": "Huyện",
            "provinceId": "26",
            "usignName": "vinh tuong"
        },
        {
            "name": "Sông Lô",
            "type": "Huyện",
            "provinceId": "26",
            "usignName": "song lo"
        },
        {
            "name": "Bắc Ninh",
            "type": "Thành Phố",
            "provinceId": "27",
            "usignName": "bac ninh"
        },
        {
            "name": "Yên Phong",
            "type": "Huyện",
            "provinceId": "27",
            "usignName": "yen phong"
        },
        {
            "name": "Quế Võ",
            "type": "Huyện",
            "provinceId": "27",
            "usignName": "que vo"
        },
        {
            "name": "Tiên Du",
            "type": "Huyện",
            "provinceId": "27",
            "usignName": "tien du"
        },
        {
            "name": "Từ Sơn",
            "type": "Thị Xã",
            "provinceId": "27",
            "usignName": "tu son"
        },
        {
            "name": "Thuận Thành",
            "type": "Huyện",
            "provinceId": "27",
            "usignName": "thuan thanh"
        },
        {
            "name": "Gia Bình",
            "type": "Huyện",
            "provinceId": "27",
            "usignName": "gia binh"
        },
        {
            "name": "Lương Tài",
            "type": "Huyện",
            "provinceId": "27",
            "usignName": "luong tai"
        },
        {
            "name": "Hà Đông",
            "type": "Quận",
            "provinceId": "1",
            "usignName": "ha dong"
        },
        {
            "name": "Sơn Tây",
            "type": "Thị Xã",
            "provinceId": "1",
            "usignName": "son tay"
        },
        {
            "name": "Ba Vì",
            "type": "Huyện",
            "provinceId": "1",
            "usignName": "ba vi"
        },
        {
            "name": "Phúc Thọ",
            "type": "Huyện",
            "provinceId": "1",
            "usignName": "phuc tho"
        },
        {
            "name": "Đan Phượng",
            "type": "Huyện",
            "provinceId": "1",
            "usignName": "dan phuong"
        },
        {
            "name": "Hoài Đức",
            "type": "Huyện",
            "provinceId": "1",
            "usignName": "hoai duc"
        },
        {
            "name": "Quốc Oai",
            "type": "Huyện",
            "provinceId": "1",
            "usignName": "quoc oai"
        },
        {
            "name": "Thạch Thất",
            "type": "Huyện",
            "provinceId": "1",
            "usignName": "thach that"
        },
        {
            "name": "Chương Mỹ",
            "type": "Huyện",
            "provinceId": "1",
            "usignName": "chuong my"
        },
        {
            "name": "Thanh Oai",
            "type": "Huyện",
            "provinceId": "1",
            "usignName": "thanh oai"
        },
        {
            "name": "Thường Tín",
            "type": "Huyện",
            "provinceId": "1",
            "usignName": "thuong tin"
        },
        {
            "name": "Phú Xuyên",
            "type": "Huyện",
            "provinceId": "1",
            "usignName": "phu xuyen"
        },
        {
            "name": "Ứng Hòa",
            "type": "Huyện",
            "provinceId": "1",
            "usignName": "?ng hoa"
        },
        {
            "name": "Mỹ Đức",
            "type": "Huyện",
            "provinceId": "1",
            "usignName": "my duc"
        },
        {
            "name": "Hải Dương",
            "type": "Thành Phố",
            "provinceId": "30",
            "usignName": "hai duong"
        },
        {
            "name": "Chí Linh",
            "type": "Huyện",
            "provinceId": "30",
            "usignName": "chi linh"
        },
        {
            "name": "Nam Sách",
            "type": "Huyện",
            "provinceId": "30",
            "usignName": "nam sach"
        },
        {
            "name": "Kinh Môn",
            "type": "Huyện",
            "provinceId": "30",
            "usignName": "kinh mon"
        },
        {
            "name": "Kim Thành",
            "type": "Huyện",
            "provinceId": "30",
            "usignName": "kim thanh"
        },
        {
            "name": "Thanh Hà",
            "type": "Huyện",
            "provinceId": "30",
            "usignName": "thanh ha"
        },
        {
            "name": "Cẩm Giàng",
            "type": "Huyện",
            "provinceId": "30",
            "usignName": "cam giang"
        },
        {
            "name": "Bình Giang",
            "type": "Huyện",
            "provinceId": "30",
            "usignName": "binh giang"
        },
        {
            "name": "Gia Lộc",
            "type": "Huyện",
            "provinceId": "30",
            "usignName": "gia loc"
        },
        {
            "name": "Tứ Kỳ",
            "type": "Huyện",
            "provinceId": "30",
            "usignName": "tu ky"
        },
        {
            "name": "Ninh Giang",
            "type": "Huyện",
            "provinceId": "30",
            "usignName": "ninh giang"
        },
        {
            "name": "Thanh Miện",
            "type": "Huyện",
            "provinceId": "30",
            "usignName": "thanh mien"
        },
        {
            "name": "Hồng Bàng",
            "type": "Quận",
            "provinceId": "31",
            "usignName": "hong bang"
        },
        {
            "name": "Ngô Quyền",
            "type": "Quận",
            "provinceId": "31",
            "usignName": "ngo quyen"
        },
        {
            "name": "Lê Chân",
            "type": "Quận",
            "provinceId": "31",
            "usignName": "le chan"
        },
        {
            "name": "Hải An",
            "type": "Quận",
            "provinceId": "31",
            "usignName": "hai an"
        },
        {
            "name": "Kiến An",
            "type": "Quận",
            "provinceId": "31",
            "usignName": "kien an"
        },
        {
            "name": "Đồ Sơn",
            "type": "Quận",
            "provinceId": "31",
            "usignName": "do son"
        },
        {
            "name": "Kinh Dương",
            "type": "Quận",
            "provinceId": "31",
            "usignName": "kinh duong"
        },
        {
            "name": "Thuỷ Nguyên",
            "type": "Huyện",
            "provinceId": "31",
            "usignName": "thuy nguyen"
        },
        {
            "name": "An Dương",
            "type": "Huyện",
            "provinceId": "31",
            "usignName": "an duong"
        },
        {
            "name": "An Lão",
            "type": "Huyện",
            "provinceId": "31",
            "usignName": "an lao"
        },
        {
            "name": "Kiến Thụy",
            "type": "Huyện",
            "provinceId": "31",
            "usignName": "kien thuy"
        },
        {
            "name": "Tiên Lãng",
            "type": "Huyện",
            "provinceId": "31",
            "usignName": "tien lang"
        },
        {
            "name": "Vĩnh Bảo",
            "type": "Huyện",
            "provinceId": "31",
            "usignName": "vinh bao"
        },
        {
            "name": "Cát Hải",
            "type": "Huyện",
            "provinceId": "31",
            "usignName": "cat hai"
        },
        {
            "name": "Bạch Long Vĩ",
            "type": "Huyện",
            "provinceId": "31",
            "usignName": "bach long vi"
        },
        {
            "name": "Hưng Yên",
            "type": "Thành Phố",
            "provinceId": "33",
            "usignName": "hung yen"
        },
        {
            "name": "Văn Lâm",
            "type": "Huyện",
            "provinceId": "33",
            "usignName": "van lam"
        },
        {
            "name": "Văn Giang",
            "type": "Huyện",
            "provinceId": "33",
            "usignName": "van giang"
        },
        {
            "name": "Yên Mỹ",
            "type": "Huyện",
            "provinceId": "33",
            "usignName": "yen my"
        },
        {
            "name": "Mỹ Hào",
            "type": "Huyện",
            "provinceId": "33",
            "usignName": "my hao"
        },
        {
            "name": "Ân Thi",
            "type": "Huyện",
            "provinceId": "33",
            "usignName": "an thi"
        },
        {
            "name": "Khoái Châu",
            "type": "Huyện",
            "provinceId": "33",
            "usignName": "khoai chau"
        },
        {
            "name": "Kim Động",
            "type": "Huyện",
            "provinceId": "33",
            "usignName": "kim dong"
        },
        {
            "name": "Tiên Lữ",
            "type": "Huyện",
            "provinceId": "33",
            "usignName": "tien lu"
        },
        {
            "name": "Phù Cừ",
            "type": "Huyện",
            "provinceId": "33",
            "usignName": "phu cu"
        },
        {
            "name": "Thái Bình",
            "type": "Thành Phố",
            "provinceId": "34",
            "usignName": "thai binh"
        },
        {
            "name": "Quỳnh Phụ",
            "type": "Huyện",
            "provinceId": "34",
            "usignName": "quynh phu"
        },
        {
            "name": "Hưng Hà",
            "type": "Huyện",
            "provinceId": "34",
            "usignName": "hung ha"
        },
        {
            "name": "Đông Hưng",
            "type": "Huyện",
            "provinceId": "34",
            "usignName": "dong hung"
        },
        {
            "name": "Thái Thụy",
            "type": "Huyện",
            "provinceId": "34",
            "usignName": "thai thuy"
        },
        {
            "name": "Tiền Hải",
            "type": "Huyện",
            "provinceId": "34",
            "usignName": "tien hai"
        },
        {
            "name": "Kiến Xương",
            "type": "Huyện",
            "provinceId": "34",
            "usignName": "kien xuong"
        },
        {
            "name": "Vũ Thư",
            "type": "Huyện",
            "provinceId": "34",
            "usignName": "vu thu"
        },
        {
            "name": "Phủ Lý",
            "type": "Thành Phố",
            "provinceId": "35",
            "usignName": "phu ly"
        },
        {
            "name": "Duy Tiên",
            "type": "Huyện",
            "provinceId": "35",
            "usignName": "duy tien"
        },
        {
            "name": "Kim Bảng",
            "type": "Huyện",
            "provinceId": "35",
            "usignName": "kim bang"
        },
        {
            "name": "Thanh Liêm",
            "type": "Huyện",
            "provinceId": "35",
            "usignName": "thanh liem"
        },
        {
            "name": "Bình Lục",
            "type": "Huyện",
            "provinceId": "35",
            "usignName": "binh luc"
        },
        {
            "name": "Lý Nhân",
            "type": "Huyện",
            "provinceId": "35",
            "usignName": "ly nhan"
        },
        {
            "name": "Nam Định",
            "type": "Thành Phố",
            "provinceId": "36",
            "usignName": "nam dinh"
        },
        {
            "name": "Mỹ Lộc",
            "type": "Huyện",
            "provinceId": "36",
            "usignName": "my loc"
        },
        {
            "name": "Vụ Bản",
            "type": "Huyện",
            "provinceId": "36",
            "usignName": "vu ban"
        },
        {
            "name": "Ý Yên",
            "type": "Huyện",
            "provinceId": "36",
            "usignName": "ý yen"
        },
        {
            "name": "Nghĩa Hưng",
            "type": "Huyện",
            "provinceId": "36",
            "usignName": "nghia hung"
        },
        {
            "name": "Nam Trực",
            "type": "Huyện",
            "provinceId": "36",
            "usignName": "nam truc"
        },
        {
            "name": "Trực Ninh",
            "type": "Huyện",
            "provinceId": "36",
            "usignName": "truc ninh"
        },
        {
            "name": "Xuân Trường",
            "type": "Huyện",
            "provinceId": "36",
            "usignName": "xuan truong"
        },
        {
            "name": "Giao Thủy",
            "type": "Huyện",
            "provinceId": "36",
            "usignName": "giao thuy"
        },
        {
            "name": "Hải Hậu",
            "type": "Huyện",
            "provinceId": "36",
            "usignName": "hai hau"
        },
        {
            "name": "Ninh Bình",
            "type": "Thành Phố",
            "provinceId": "37",
            "usignName": "ninh binh"
        },
        {
            "name": "Tam Điệp",
            "type": "Thị Xã",
            "provinceId": "37",
            "usignName": "tam diep"
        },
        {
            "name": "Nho Quan",
            "type": "Huyện",
            "provinceId": "37",
            "usignName": "nho quan"
        },
        {
            "name": "Gia Viễn",
            "type": "Huyện",
            "provinceId": "37",
            "usignName": "gia vien"
        },
        {
            "name": "Hoa Lư",
            "type": "Huyện",
            "provinceId": "37",
            "usignName": "hoa lu"
        },
        {
            "name": "Yên Khánh",
            "type": "Huyện",
            "provinceId": "37",
            "usignName": "yen khanh"
        },
        {
            "name": "Kim Sơn",
            "type": "Huyện",
            "provinceId": "37",
            "usignName": "kim son"
        },
        {
            "name": "Yên Mô",
            "type": "Huyện",
            "provinceId": "37",
            "usignName": "yen mo"
        },
        {
            "name": "Thanh Hóa",
            "type": "Thành Phố",
            "provinceId": "38",
            "usignName": "thanh hoa"
        },
        {
            "name": "Bỉm Sơn",
            "type": "Thị Xã",
            "provinceId": "38",
            "usignName": "bim son"
        },
        {
            "name": "Sầm Sơn",
            "type": "Thị Xã",
            "provinceId": "38",
            "usignName": "sam son"
        },
        {
            "name": "Mường Lát",
            "type": "Huyện",
            "provinceId": "38",
            "usignName": "muong lat"
        },
        {
            "name": "Quan Hóa",
            "type": "Huyện",
            "provinceId": "38",
            "usignName": "quan hoa"
        },
        {
            "name": "Bá Thước",
            "type": "Huyện",
            "provinceId": "38",
            "usignName": "ba thuoc"
        },
        {
            "name": "Quan Sơn",
            "type": "Huyện",
            "provinceId": "38",
            "usignName": "quan son"
        },
        {
            "name": "Lang Chánh",
            "type": "Huyện",
            "provinceId": "38",
            "usignName": "lang chanh"
        },
        {
            "name": "Ngọc Lặc",
            "type": "Huyện",
            "provinceId": "38",
            "usignName": "ngoc lac"
        },
        {
            "name": "Cẩm Thủy",
            "type": "Huyện",
            "provinceId": "38",
            "usignName": "cam thuy"
        },
        {
            "name": "Thạch Thành",
            "type": "Huyện",
            "provinceId": "38",
            "usignName": "thach thanh"
        },
        {
            "name": "Hà Trung",
            "type": "Huyện",
            "provinceId": "38",
            "usignName": "ha trung"
        },
        {
            "name": "Vĩnh Lộc",
            "type": "Huyện",
            "provinceId": "38",
            "usignName": "vinh loc"
        },
        {
            "name": "Yên Định",
            "type": "Huyện",
            "provinceId": "38",
            "usignName": "yen dinh"
        },
        {
            "name": "Thọ Xuân",
            "type": "Huyện",
            "provinceId": "38",
            "usignName": "tho xuan"
        },
        {
            "name": "Thường Xuân",
            "type": "Huyện",
            "provinceId": "38",
            "usignName": "thuong xuan"
        },
        {
            "name": "Triệu Sơn",
            "type": "Huyện",
            "provinceId": "38",
            "usignName": "trieu son"
        },
        {
            "name": "Thiệu Hoá",
            "type": "Huyện",
            "provinceId": "38",
            "usignName": "thieu hoa"
        },
        {
            "name": "Hoằng Hóa",
            "type": "Huyện",
            "provinceId": "38",
            "usignName": "hoang hoa"
        },
        {
            "name": "Hậu Lộc",
            "type": "Huyện",
            "provinceId": "38",
            "usignName": "hau loc"
        },
        {
            "name": "Nga Sơn",
            "type": "Huyện",
            "provinceId": "38",
            "usignName": "nga son"
        },
        {
            "name": "Như Xuân",
            "type": "Huyện",
            "provinceId": "38",
            "usignName": "nhu xuan"
        },
        {
            "name": "Như Thanh",
            "type": "Huyện",
            "provinceId": "38",
            "usignName": "nhu thanh"
        },
        {
            "name": "Nông Cống",
            "type": "Huyện",
            "provinceId": "38",
            "usignName": "nong cong"
        },
        {
            "name": "Đông Sơn",
            "type": "Huyện",
            "provinceId": "38",
            "usignName": "dong son"
        },
        {
            "name": "Quảng Xương",
            "type": "Huyện",
            "provinceId": "38",
            "usignName": "quang xuong"
        },
        {
            "name": "Tĩnh Gia",
            "type": "Huyện",
            "provinceId": "38",
            "usignName": "tinh gia"
        },
        {
            "name": "Vinh",
            "type": "Thành Phố",
            "provinceId": "40",
            "usignName": "vinh"
        },
        {
            "name": "Cửa Lò",
            "type": "Thị Xã",
            "provinceId": "40",
            "usignName": "cua lo"
        },
        {
            "name": "Thái Hoà",
            "type": "Thị Xã",
            "provinceId": "40",
            "usignName": "thai hoa"
        },
        {
            "name": "Quế Phong",
            "type": "Huyện",
            "provinceId": "40",
            "usignName": "que phong"
        },
        {
            "name": "Quỳ Châu",
            "type": "Huyện",
            "provinceId": "40",
            "usignName": "quy chau"
        },
        {
            "name": "Kỳ Sơn",
            "type": "Huyện",
            "provinceId": "40",
            "usignName": "ky son"
        },
        {
            "name": "Tương Dương",
            "type": "Huyện",
            "provinceId": "40",
            "usignName": "tuong duong"
        },
        {
            "name": "Nghĩa Đàn",
            "type": "Huyện",
            "provinceId": "40",
            "usignName": "nghia dan"
        },
        {
            "name": "Quỳ Hợp",
            "type": "Huyện",
            "provinceId": "40",
            "usignName": "quy hop"
        },
        {
            "name": "Quỳnh Lưu",
            "type": "Huyện",
            "provinceId": "40",
            "usignName": "quynh luu"
        },
        {
            "name": "Con Cuông",
            "type": "Huyện",
            "provinceId": "40",
            "usignName": "con cuong"
        },
        {
            "name": "Tân Kỳ",
            "type": "Huyện",
            "provinceId": "40",
            "usignName": "tan ky"
        },
        {
            "name": "Anh Sơn",
            "type": "Huyện",
            "provinceId": "40",
            "usignName": "anh son"
        },
        {
            "name": "Diễn Châu",
            "type": "Huyện",
            "provinceId": "40",
            "usignName": "dien chau"
        },
        {
            "name": "Yên Thành",
            "type": "Huyện",
            "provinceId": "40",
            "usignName": "yen thanh"
        },
        {
            "name": "Đô Lương",
            "type": "Huyện",
            "provinceId": "40",
            "usignName": "do luong"
        },
        {
            "name": "Thanh Chương",
            "type": "Huyện",
            "provinceId": "40",
            "usignName": "thanh chuong"
        },
        {
            "name": "Nghi Lộc",
            "type": "Huyện",
            "provinceId": "40",
            "usignName": "nghi loc"
        },
        {
            "name": "Nam Đàn",
            "type": "Huyện",
            "provinceId": "40",
            "usignName": "nam dan"
        },
        {
            "name": "Hưng Nguyên",
            "type": "Huyện",
            "provinceId": "40",
            "usignName": "hung nguyen"
        },
        {
            "name": "Hà Tĩnh",
            "type": "Thành Phố",
            "provinceId": "42",
            "usignName": "ha tinh"
        },
        {
            "name": "Hồng Lĩnh",
            "type": "Thị Xã",
            "provinceId": "42",
            "usignName": "hong linh"
        },
        {
            "name": "Hương Sơn",
            "type": "Huyện",
            "provinceId": "42",
            "usignName": "huong son"
        },
        {
            "name": "Đức Thọ",
            "type": "Huyện",
            "provinceId": "42",
            "usignName": "duc tho"
        },
        {
            "name": "Vũ Quang",
            "type": "Huyện",
            "provinceId": "42",
            "usignName": "vu quang"
        },
        {
            "name": "Nghi Xuân",
            "type": "Huyện",
            "provinceId": "42",
            "usignName": "nghi xuan"
        },
        {
            "name": "Can Lộc",
            "type": "Huyện",
            "provinceId": "42",
            "usignName": "can loc"
        },
        {
            "name": "Hương Khê",
            "type": "Huyện",
            "provinceId": "42",
            "usignName": "huong khe"
        },
        {
            "name": "Thạch Hà",
            "type": "Huyện",
            "provinceId": "42",
            "usignName": "thach ha"
        },
        {
            "name": "Cẩm Xuyên",
            "type": "Huyện",
            "provinceId": "42",
            "usignName": "cam xuyen"
        },
        {
            "name": "Kỳ Anh",
            "type": "Huyện",
            "provinceId": "42",
            "usignName": "ky anh"
        },
        {
            "name": "Lộc Hà",
            "type": "Huyện",
            "provinceId": "42",
            "usignName": "loc ha"
        },
        {
            "name": "Đồng Hới",
            "type": "Thành Phố",
            "provinceId": "44",
            "usignName": "dong hoi"
        },
        {
            "name": "Minh Hóa",
            "type": "Huyện",
            "provinceId": "44",
            "usignName": "minh hoa"
        },
        {
            "name": "Tuyên Hóa",
            "type": "Huyện",
            "provinceId": "44",
            "usignName": "tuyen hoa"
        },
        {
            "name": "Quảng Trạch",
            "type": "Huyện",
            "provinceId": "44",
            "usignName": "quang trach"
        },
        {
            "name": "Bố Trạch",
            "type": "Huyện",
            "provinceId": "44",
            "usignName": "bo trach"
        },
        {
            "name": "Quảng Ninh",
            "type": "Huyện",
            "provinceId": "44",
            "usignName": "quang ninh"
        },
        {
            "name": "Lệ Thủy",
            "type": "Huyện",
            "provinceId": "44",
            "usignName": "le thuy"
        },
        {
            "name": "Đông Hà",
            "type": "Thành Phố",
            "provinceId": "45",
            "usignName": "dong ha"
        },
        {
            "name": "Quảng Trị",
            "type": "Thị Xã",
            "provinceId": "45",
            "usignName": "quang tri"
        },
        {
            "name": "Vĩnh Linh",
            "type": "Huyện",
            "provinceId": "45",
            "usignName": "vinh linh"
        },
        {
            "name": "Hướng Hóa",
            "type": "Huyện",
            "provinceId": "45",
            "usignName": "huong hoa"
        },
        {
            "name": "Gio Linh",
            "type": "Huyện",
            "provinceId": "45",
            "usignName": "gio linh"
        },
        {
            "name": "Đa Krông",
            "type": "Huyện",
            "provinceId": "45",
            "usignName": "da krong"
        },
        {
            "name": "Cam Lộ",
            "type": "Huyện",
            "provinceId": "45",
            "usignName": "cam lo"
        },
        {
            "name": "Triệu Phong",
            "type": "Huyện",
            "provinceId": "45",
            "usignName": "trieu phong"
        },
        {
            "name": "Hải Lăng",
            "type": "Huyện",
            "provinceId": "45",
            "usignName": "hai lang"
        },
        {
            "name": "Cồn Cỏ",
            "type": "Huyện",
            "provinceId": "45",
            "usignName": "con co"
        },
        {
            "name": "Huế",
            "type": "Thành Phố",
            "provinceId": "46",
            "usignName": "hue"
        },
        {
            "name": "Phong Điền",
            "type": "Huyện",
            "provinceId": "46",
            "usignName": "phong dien"
        },
        {
            "name": "Quảng Điền",
            "type": "Huyện",
            "provinceId": "46",
            "usignName": "quang dien"
        },
        {
            "name": "Phú Vang",
            "type": "Huyện",
            "provinceId": "46",
            "usignName": "phu vang"
        },
        {
            "name": "Hương Thủy",
            "type": "Huyện",
            "provinceId": "46",
            "usignName": "huong thuy"
        },
        {
            "name": "Hương Trà",
            "type": "Huyện",
            "provinceId": "46",
            "usignName": "huong tra"
        },
        {
            "name": "A Lưới",
            "type": "Huyện",
            "provinceId": "46",
            "usignName": "a luoi"
        },
        {
            "name": "Phú Lộc",
            "type": "Huyện",
            "provinceId": "46",
            "usignName": "phu loc"
        },
        {
            "name": "Nam Đông",
            "type": "Huyện",
            "provinceId": "46",
            "usignName": "nam dong"
        },
        {
            "name": "Liên Chiểu",
            "type": "Quận",
            "provinceId": "48",
            "usignName": "lien chieu"
        },
        {
            "name": "Thanh Khê",
            "type": "Quận",
            "provinceId": "48",
            "usignName": "thanh khe"
        },
        {
            "name": "Hải Châu",
            "type": "Quận",
            "provinceId": "48",
            "usignName": "hai chau"
        },
        {
            "name": "Sơn Trà",
            "type": "Quận",
            "provinceId": "48",
            "usignName": "son tra"
        },
        {
            "name": "Ngũ Hành Sơn",
            "type": "Quận",
            "provinceId": "48",
            "usignName": "ngu hanh son"
        },
        {
            "name": "Cẩm Lệ",
            "type": "Quận",
            "provinceId": "48",
            "usignName": "cam le"
        },
        {
            "name": "Hoà Vang",
            "type": "Huyện",
            "provinceId": "48",
            "usignName": "hoa vang"
        },
        {
            "name": "Hoàng Sa",
            "type": "Huyện",
            "provinceId": "48",
            "usignName": "hoang sa"
        },
        {
            "name": "Tam Kỳ",
            "type": "Thành Phố",
            "provinceId": "49",
            "usignName": "tam ky"
        },
        {
            "name": "Hội An",
            "type": "Thành Phố",
            "provinceId": "49",
            "usignName": "hoi an"
        },
        {
            "name": "Tây Giang",
            "type": "Huyện",
            "provinceId": "49",
            "usignName": "tay giang"
        },
        {
            "name": "Đông Giang",
            "type": "Huyện",
            "provinceId": "49",
            "usignName": "dong giang"
        },
        {
            "name": "Đại Lộc",
            "type": "Huyện",
            "provinceId": "49",
            "usignName": "dai loc"
        },
        {
            "name": "Điện Bàn",
            "type": "Huyện",
            "provinceId": "49",
            "usignName": "dien ban"
        },
        {
            "name": "Duy Xuyên",
            "type": "Huyện",
            "provinceId": "49",
            "usignName": "duy xuyen"
        },
        {
            "name": "Quế Sơn",
            "type": "Huyện",
            "provinceId": "49",
            "usignName": "que son"
        },
        {
            "name": "Nam Giang",
            "type": "Huyện",
            "provinceId": "49",
            "usignName": "nam giang"
        },
        {
            "name": "Phước Sơn",
            "type": "Huyện",
            "provinceId": "49",
            "usignName": "phuoc son"
        },
        {
            "name": "Hiệp Đức",
            "type": "Huyện",
            "provinceId": "49",
            "usignName": "hiep duc"
        },
        {
            "name": "Thăng Bình",
            "type": "Huyện",
            "provinceId": "49",
            "usignName": "thang binh"
        },
        {
            "name": "Tiên Phước",
            "type": "Huyện",
            "provinceId": "49",
            "usignName": "tien phuoc"
        },
        {
            "name": "Bắc Trà My",
            "type": "Huyện",
            "provinceId": "49",
            "usignName": "bac tra my"
        },
        {
            "name": "Nam Trà My",
            "type": "Huyện",
            "provinceId": "49",
            "usignName": "nam tra my"
        },
        {
            "name": "Núi Thành",
            "type": "Huyện",
            "provinceId": "49",
            "usignName": "nui thanh"
        },
        {
            "name": "Phú Ninh",
            "type": "Huyện",
            "provinceId": "49",
            "usignName": "phu ninh"
        },
        {
            "name": "Nông Sơn",
            "type": "Huyện",
            "provinceId": "49",
            "usignName": "nong son"
        },
        {
            "name": "Quảng Ngãi",
            "type": "Thành Phố",
            "provinceId": "51",
            "usignName": "quang ngai"
        },
        {
            "name": "Bình Sơn",
            "type": "Huyện",
            "provinceId": "51",
            "usignName": "binh son"
        },
        {
            "name": "Trà Bồng",
            "type": "Huyện",
            "provinceId": "51",
            "usignName": "tra bong"
        },
        {
            "name": "Tây Trà",
            "type": "Huyện",
            "provinceId": "51",
            "usignName": "tay tra"
        },
        {
            "name": "Sơn Tịnh",
            "type": "Huyện",
            "provinceId": "51",
            "usignName": "son tinh"
        },
        {
            "name": "Tư Nghĩa",
            "type": "Huyện",
            "provinceId": "51",
            "usignName": "tu nghia"
        },
        {
            "name": "Sơn Hà",
            "type": "Huyện",
            "provinceId": "51",
            "usignName": "son ha"
        },
        {
            "name": "Sơn Tây",
            "type": "Huyện",
            "provinceId": "51",
            "usignName": "son tay"
        },
        {
            "name": "Minh Long",
            "type": "Huyện",
            "provinceId": "51",
            "usignName": "minh long"
        },
        {
            "name": "Nghĩa Hành",
            "type": "Huyện",
            "provinceId": "51",
            "usignName": "nghia hanh"
        },
        {
            "name": "Mộ Đức",
            "type": "Huyện",
            "provinceId": "51",
            "usignName": "mo duc"
        },
        {
            "name": "Đức Phổ",
            "type": "Huyện",
            "provinceId": "51",
            "usignName": "duc pho"
        },
        {
            "name": "Ba Tơ",
            "type": "Huyện",
            "provinceId": "51",
            "usignName": "ba to"
        },
        {
            "name": "Lý Sơn",
            "type": "Huyện",
            "provinceId": "51",
            "usignName": "ly son"
        },
        {
            "name": "Quy Nhơn",
            "type": "Thành Phố",
            "provinceId": "52",
            "usignName": "quy nhon"
        },
        {
            "name": "An Lão",
            "type": "Huyện",
            "provinceId": "52",
            "usignName": "an lao"
        },
        {
            "name": "Hoài Nhơn",
            "type": "Huyện",
            "provinceId": "52",
            "usignName": "hoai nhon"
        },
        {
            "name": "Hoài Ân",
            "type": "Huyện",
            "provinceId": "52",
            "usignName": "hoai an"
        },
        {
            "name": "Phù Mỹ",
            "type": "Huyện",
            "provinceId": "52",
            "usignName": "phu my"
        },
        {
            "name": "Vĩnh Thạnh",
            "type": "Huyện",
            "provinceId": "52",
            "usignName": "vinh thanh"
        },
        {
            "name": "Tây Sơn",
            "type": "Huyện",
            "provinceId": "52",
            "usignName": "tay son"
        },
        {
            "name": "Phù Cát",
            "type": "Huyện",
            "provinceId": "52",
            "usignName": "phu cat"
        },
        {
            "name": "An Nhơn",
            "type": "Huyện",
            "provinceId": "52",
            "usignName": "an nhon"
        },
        {
            "name": "Tuy Phước",
            "type": "Huyện",
            "provinceId": "52",
            "usignName": "tuy phuoc"
        },
        {
            "name": "Vân Canh",
            "type": "Huyện",
            "provinceId": "52",
            "usignName": "van canh"
        },
        {
            "name": "Tuy Hòa",
            "type": "Thành Phố",
            "provinceId": "54",
            "usignName": "tuy hoa"
        },
        {
            "name": "Sông Cầu",
            "type": "Thị Xã",
            "provinceId": "54",
            "usignName": "song cau"
        },
        {
            "name": "Đồng Xuân",
            "type": "Huyện",
            "provinceId": "54",
            "usignName": "dong xuan"
        },
        {
            "name": "Tuy An",
            "type": "Huyện",
            "provinceId": "54",
            "usignName": "tuy an"
        },
        {
            "name": "Sơn Hòa",
            "type": "Huyện",
            "provinceId": "54",
            "usignName": "son hoa"
        },
        {
            "name": "Sông Hinh",
            "type": "Huyện",
            "provinceId": "54",
            "usignName": "song hinh"
        },
        {
            "name": "Tây Hoà",
            "type": "Huyện",
            "provinceId": "54",
            "usignName": "tay hoa"
        },
        {
            "name": "Phú Hoà",
            "type": "Huyện",
            "provinceId": "54",
            "usignName": "phu hoa"
        },
        {
            "name": "Đông Hoà",
            "type": "Huyện",
            "provinceId": "54",
            "usignName": "dong hoa"
        },
        {
            "name": "Nha Trang",
            "type": "Thành Phố",
            "provinceId": "56",
            "usignName": "nha trang"
        },
        {
            "name": "Cam Ranh",
            "type": "Thị Xã",
            "provinceId": "56",
            "usignName": "cam ranh"
        },
        {
            "name": "Cam Lâm",
            "type": "Huyện",
            "provinceId": "56",
            "usignName": "cam lam"
        },
        {
            "name": "Vạn Ninh",
            "type": "Huyện",
            "provinceId": "56",
            "usignName": "van ninh"
        },
        {
            "name": "Ninh Hòa",
            "type": "Huyện",
            "provinceId": "56",
            "usignName": "ninh hoa"
        },
        {
            "name": "Khánh Vĩnh",
            "type": "Huyện",
            "provinceId": "56",
            "usignName": "khanh vinh"
        },
        {
            "name": "Diên Khánh",
            "type": "Huyện",
            "provinceId": "56",
            "usignName": "dien khanh"
        },
        {
            "name": "Khánh Sơn",
            "type": "Huyện",
            "provinceId": "56",
            "usignName": "khanh son"
        },
        {
            "name": "Trường Sa",
            "type": "Huyện",
            "provinceId": "56",
            "usignName": "truong sa"
        },
        {
            "name": "Phan Rang-Tháp Chàm",
            "type": "Thành Phố",
            "provinceId": "58",
            "usignName": "phan rang-thap cham"
        },
        {
            "name": "Bác Ái",
            "type": "Huyện",
            "provinceId": "58",
            "usignName": "bac ai"
        },
        {
            "name": "Ninh Sơn",
            "type": "Huyện",
            "provinceId": "58",
            "usignName": "ninh son"
        },
        {
            "name": "Ninh Hải",
            "type": "Huyện",
            "provinceId": "58",
            "usignName": "ninh hai"
        },
        {
            "name": "Ninh Phước",
            "type": "Huyện",
            "provinceId": "58",
            "usignName": "ninh phuoc"
        },
        {
            "name": "Thuận Bắc",
            "type": "Huyện",
            "provinceId": "58",
            "usignName": "thuan bac"
        },
        {
            "name": "Thuận Nam",
            "type": "Huyện",
            "provinceId": "58",
            "usignName": "thuan nam"
        },
        {
            "name": "Phan Thiết",
            "type": "Thành Phố",
            "provinceId": "60",
            "usignName": "phan thiet"
        },
        {
            "name": "La Gi",
            "type": "Thị Xã",
            "provinceId": "60",
            "usignName": "la gi"
        },
        {
            "name": "Tuy Phong",
            "type": "Huyện",
            "provinceId": "60",
            "usignName": "tuy phong"
        },
        {
            "name": "Bắc Bình",
            "type": "Huyện",
            "provinceId": "60",
            "usignName": "bac binh"
        },
        {
            "name": "Hàm Thuận Bắc",
            "type": "Huyện",
            "provinceId": "60",
            "usignName": "ham thuan bac"
        },
        {
            "name": "Hàm Thuận Nam",
            "type": "Huyện",
            "provinceId": "60",
            "usignName": "ham thuan nam"
        },
        {
            "name": "Tánh Linh",
            "type": "Huyện",
            "provinceId": "60",
            "usignName": "tanh linh"
        },
        {
            "name": "Đức Linh",
            "type": "Huyện",
            "provinceId": "60",
            "usignName": "duc linh"
        },
        {
            "name": "Hàm Tân",
            "type": "Huyện",
            "provinceId": "60",
            "usignName": "ham tan"
        },
        {
            "name": "Phú Quí",
            "type": "Huyện",
            "provinceId": "60",
            "usignName": "phu qui"
        },
        {
            "name": "Kon Tum",
            "type": "Thành Phố",
            "provinceId": "62",
            "usignName": "kon tum"
        },
        {
            "name": "Đắk Glei",
            "type": "Huyện",
            "provinceId": "62",
            "usignName": "dak glei"
        },
        {
            "name": "Ngọc Hồi",
            "type": "Huyện",
            "provinceId": "62",
            "usignName": "ngoc hoi"
        },
        {
            "name": "Đắk Tô",
            "type": "Huyện",
            "provinceId": "62",
            "usignName": "dak to"
        },
        {
            "name": "Kon Plông",
            "type": "Huyện",
            "provinceId": "62",
            "usignName": "kon plong"
        },
        {
            "name": "Kon Rẫy",
            "type": "Huyện",
            "provinceId": "62",
            "usignName": "kon ray"
        },
        {
            "name": "Đắk Hà",
            "type": "Huyện",
            "provinceId": "62",
            "usignName": "dak ha"
        },
        {
            "name": "Sa Thầy",
            "type": "Huyện",
            "provinceId": "62",
            "usignName": "sa thay"
        },
        {
            "name": "Tu Mơ Rông",
            "type": "Huyện",
            "provinceId": "62",
            "usignName": "tu mo rong"
        },
        {
            "name": "Pleiku",
            "type": "Thành Phố",
            "provinceId": "64",
            "usignName": "pleiku"
        },
        {
            "name": "An Khê",
            "type": "Thị Xã",
            "provinceId": "64",
            "usignName": "an khe"
        },
        {
            "name": "Ayun Pa",
            "type": "Thị Xã",
            "provinceId": "64",
            "usignName": "ayun pa"
        },
        {
            "name": "Kbang",
            "type": "Huyện",
            "provinceId": "64",
            "usignName": "kbang"
        },
        {
            "name": "Đăk Đoa",
            "type": "Huyện",
            "provinceId": "64",
            "usignName": "dak doa"
        },
        {
            "name": "Chư Păh",
            "type": "Huyện",
            "provinceId": "64",
            "usignName": "chu pah"
        },
        {
            "name": "Ia Grai",
            "type": "Huyện",
            "provinceId": "64",
            "usignName": "ia grai"
        },
        {
            "name": "Mang Yang",
            "type": "Huyện",
            "provinceId": "64",
            "usignName": "mang yang"
        },
        {
            "name": "Kông Chro",
            "type": "Huyện",
            "provinceId": "64",
            "usignName": "kong chro"
        },
        {
            "name": "Đức Cơ",
            "type": "Huyện",
            "provinceId": "64",
            "usignName": "duc co"
        },
        {
            "name": "Chư Prông",
            "type": "Huyện",
            "provinceId": "64",
            "usignName": "chu prong"
        },
        {
            "name": "Chư Sê",
            "type": "Huyện",
            "provinceId": "64",
            "usignName": "chu se"
        },
        {
            "name": "Đăk Pơ",
            "type": "Huyện",
            "provinceId": "64",
            "usignName": "dak po"
        },
        {
            "name": "Ia Pa",
            "type": "Huyện",
            "provinceId": "64",
            "usignName": "ia pa"
        },
        {
            "name": "Krông Pa",
            "type": "Huyện",
            "provinceId": "64",
            "usignName": "krong pa"
        },
        {
            "name": "Phú Thiện",
            "type": "Huyện",
            "provinceId": "64",
            "usignName": "phu thien"
        },
        {
            "name": "Chư Pưh",
            "type": "Huyện",
            "provinceId": "64",
            "usignName": "chu puh"
        },
        {
            "name": "Buôn Ma Thuột",
            "type": "Thành Phố",
            "provinceId": "66",
            "usignName": "buon ma thuot"
        },
        {
            "name": "Buôn Hồ",
            "type": "Thị Xã",
            "provinceId": "66",
            "usignName": "buon ho"
        },
        {
            "name": "Ea H'leo",
            "type": "Huyện",
            "provinceId": "66",
            "usignName": "ea h'leo"
        },
        {
            "name": "Ea Súp",
            "type": "Huyện",
            "provinceId": "66",
            "usignName": "ea sup"
        },
        {
            "name": "Buôn Đôn",
            "type": "Huyện",
            "provinceId": "66",
            "usignName": "buon don"
        },
        {
            "name": "Cư M'gar",
            "type": "Huyện",
            "provinceId": "66",
            "usignName": "cu m'gar"
        },
        {
            "name": "Krông Búk",
            "type": "Huyện",
            "provinceId": "66",
            "usignName": "krong buk"
        },
        {
            "name": "Krông Năng",
            "type": "Huyện",
            "provinceId": "66",
            "usignName": "krong nang"
        },
        {
            "name": "Ea Kar",
            "type": "Huyện",
            "provinceId": "66",
            "usignName": "ea kar"
        },
        {
            "name": "M'đrắk",
            "type": "Huyện",
            "provinceId": "66",
            "usignName": "m'drak"
        },
        {
            "name": "Krông Bông",
            "type": "Huyện",
            "provinceId": "66",
            "usignName": "krong bong"
        },
        {
            "name": "Krông Pắc",
            "type": "Huyện",
            "provinceId": "66",
            "usignName": "krong pac"
        },
        {
            "name": "Krông A Na",
            "type": "Huyện",
            "provinceId": "66",
            "usignName": "krong a na"
        },
        {
            "name": "Lắk",
            "type": "Huyện",
            "provinceId": "66",
            "usignName": "lak"
        },
        {
            "name": "Cư Kuin",
            "type": "Huyện",
            "provinceId": "66",
            "usignName": "cu kuin"
        },
        {
            "name": "Gia Nghĩa",
            "type": "Thị Xã",
            "provinceId": "67",
            "usignName": "gia nghia"
        },
        {
            "name": "Đắk Glong",
            "type": "Huyện",
            "provinceId": "67",
            "usignName": "dak glong"
        },
        {
            "name": "Cư Jút",
            "type": "Huyện",
            "provinceId": "67",
            "usignName": "cu jut"
        },
        {
            "name": "Đắk Mil",
            "type": "Huyện",
            "provinceId": "67",
            "usignName": "dak mil"
        },
        {
            "name": "Krông Nô",
            "type": "Huyện",
            "provinceId": "67",
            "usignName": "krong no"
        },
        {
            "name": "Đắk Song",
            "type": "Huyện",
            "provinceId": "67",
            "usignName": "dak song"
        },
        {
            "name": "Đắk R'lấp",
            "type": "Huyện",
            "provinceId": "67",
            "usignName": "dak r'lap"
        },
        {
            "name": "Tuy Đức",
            "type": "Huyện",
            "provinceId": "67",
            "usignName": "tuy duc"
        },
        {
            "name": "Đà Lạt",
            "type": "Thành Phố",
            "provinceId": "68",
            "usignName": "da lat"
        },
        {
            "name": "Bảo Lộc",
            "type": "Thị Xã",
            "provinceId": "68",
            "usignName": "bao loc"
        },
        {
            "name": "Đam Rông",
            "type": "Huyện",
            "provinceId": "68",
            "usignName": "dam rong"
        },
        {
            "name": "Lạc Dương",
            "type": "Huyện",
            "provinceId": "68",
            "usignName": "lac duong"
        },
        {
            "name": "Lâm Hà",
            "type": "Huyện",
            "provinceId": "68",
            "usignName": "lam ha"
        },
        {
            "name": "Đơn Dương",
            "type": "Huyện",
            "provinceId": "68",
            "usignName": "don duong"
        },
        {
            "name": "Đức Trọng",
            "type": "Huyện",
            "provinceId": "68",
            "usignName": "duc trong"
        },
        {
            "name": "Di Linh",
            "type": "Huyện",
            "provinceId": "68",
            "usignName": "di linh"
        },
        {
            "name": "Bảo Lâm",
            "type": "Huyện",
            "provinceId": "68",
            "usignName": "bao lam"
        },
        {
            "name": "Đạ Huoai",
            "type": "Huyện",
            "provinceId": "68",
            "usignName": "da huoai"
        },
        {
            "name": "Đạ Tẻh",
            "type": "Huyện",
            "provinceId": "68",
            "usignName": "da teh"
        },
        {
            "name": "Cát Tiên",
            "type": "Huyện",
            "provinceId": "68",
            "usignName": "cat tien"
        },
        {
            "name": "Phước Long",
            "type": "Thị Xã",
            "provinceId": "70",
            "usignName": "phuoc long"
        },
        {
            "name": "Đồng Xoài",
            "type": "Thị Xã",
            "provinceId": "70",
            "usignName": "dong xoai"
        },
        {
            "name": "Bình Long",
            "type": "Thị Xã",
            "provinceId": "70",
            "usignName": "binh long"
        },
        {
            "name": "Bù Gia Mập",
            "type": "Huyện",
            "provinceId": "70",
            "usignName": "bu gia map"
        },
        {
            "name": "Lộc Ninh",
            "type": "Huyện",
            "provinceId": "70",
            "usignName": "loc ninh"
        },
        {
            "name": "Bù Đốp",
            "type": "Huyện",
            "provinceId": "70",
            "usignName": "bu dop"
        },
        {
            "name": "Hớn Quản",
            "type": "Huyện",
            "provinceId": "70",
            "usignName": "hon quan"
        },
        {
            "name": "Đồng Phù",
            "type": "Huyện",
            "provinceId": "70",
            "usignName": "dong phu"
        },
        {
            "name": "Bù Đăng",
            "type": "Huyện",
            "provinceId": "70",
            "usignName": "bu dang"
        },
        {
            "name": "Chơn Thành",
            "type": "Huyện",
            "provinceId": "70",
            "usignName": "chon thanh"
        },
        {
            "name": "Tây Ninh",
            "type": "Thị Xã",
            "provinceId": "72",
            "usignName": "tay ninh"
        },
        {
            "name": "Tân Biên",
            "type": "Huyện",
            "provinceId": "72",
            "usignName": "tan bien"
        },
        {
            "name": "Tân Châu",
            "type": "Huyện",
            "provinceId": "72",
            "usignName": "tan chau"
        },
        {
            "name": "Dương Minh Châu",
            "type": "Huyện",
            "provinceId": "72",
            "usignName": "duong minh chau"
        },
        {
            "name": "Châu Thành",
            "type": "Huyện",
            "provinceId": "72",
            "usignName": "chau thanh"
        },
        {
            "name": "Hòa Thành",
            "type": "Huyện",
            "provinceId": "72",
            "usignName": "hoa thanh"
        },
        {
            "name": "Gò Dầu",
            "type": "Huyện",
            "provinceId": "72",
            "usignName": "go dau"
        },
        {
            "name": "Bến Cầu",
            "type": "Huyện",
            "provinceId": "72",
            "usignName": "ben cau"
        },
        {
            "name": "Trảng Bàng",
            "type": "Huyện",
            "provinceId": "72",
            "usignName": "trang bang"
        },
        {
            "name": "Thủ Dầu Một",
            "type": "Thị Xã",
            "provinceId": "74",
            "usignName": "thu dau mot"
        },
        {
            "name": "Dầu Tiếng",
            "type": "Huyện",
            "provinceId": "74",
            "usignName": "dau tieng"
        },
        {
            "name": "Bến Cát",
            "type": "Huyện",
            "provinceId": "74",
            "usignName": "ben cat"
        },
        {
            "name": "Phú Giáo",
            "type": "Huyện",
            "provinceId": "74",
            "usignName": "phu giao"
        },
        {
            "name": "Tân Uyên",
            "type": "Huyện",
            "provinceId": "74",
            "usignName": "tan uyen"
        },
        {
            "name": "Dĩ An",
            "type": "Huyện",
            "provinceId": "74",
            "usignName": "di an"
        },
        {
            "name": "Thuận An",
            "type": "Huyện",
            "provinceId": "74",
            "usignName": "thuan an"
        },
        {
            "name": "Biên Hòa",
            "type": "Thành Phố",
            "provinceId": "75",
            "usignName": "bien hoa"
        },
        {
            "name": "Long Khánh",
            "type": "Thị Xã",
            "provinceId": "75",
            "usignName": "long khanh"
        },
        {
            "name": "Tân Phú",
            "type": "Huyện",
            "provinceId": "75",
            "usignName": "tan phu"
        },
        {
            "name": "Vĩnh Cửu",
            "type": "Huyện",
            "provinceId": "75",
            "usignName": "vinh cuu"
        },
        {
            "name": "Định Quán",
            "type": "Huyện",
            "provinceId": "75",
            "usignName": "dinh quan"
        },
        {
            "name": "Trảng Bom",
            "type": "Huyện",
            "provinceId": "75",
            "usignName": "trang bom"
        },
        {
            "name": "Thống Nhất",
            "type": "Huyện",
            "provinceId": "75",
            "usignName": "thong nhat"
        },
        {
            "name": "Cẩm Mỹ",
            "type": "Huyện",
            "provinceId": "75",
            "usignName": "cam my"
        },
        {
            "name": "Long Thành",
            "type": "Huyện",
            "provinceId": "75",
            "usignName": "long thanh"
        },
        {
            "name": "Xuân Lộc",
            "type": "Huyện",
            "provinceId": "75",
            "usignName": "xuan loc"
        },
        {
            "name": "Nhơn Trạch",
            "type": "Huyện",
            "provinceId": "75",
            "usignName": "nhon trach"
        },
        {
            "name": "Vũng Tầu",
            "type": "Thành Phố",
            "provinceId": "77",
            "usignName": "vung tau"
        },
        {
            "name": "Bà Rịa",
            "type": "Thị Xã",
            "provinceId": "77",
            "usignName": "ba ria"
        },
        {
            "name": "Châu Đức",
            "type": "Huyện",
            "provinceId": "77",
            "usignName": "chau duc"
        },
        {
            "name": "Xuyên Mộc",
            "type": "Huyện",
            "provinceId": "77",
            "usignName": "xuyen moc"
        },
        {
            "name": "Long Điền",
            "type": "Huyện",
            "provinceId": "77",
            "usignName": "long dien"
        },
        {
            "name": "Đất Đỏ",
            "type": "Huyện",
            "provinceId": "77",
            "usignName": "dat do"
        },
        {
            "name": "Tân Thành",
            "type": "Huyện",
            "provinceId": "77",
            "usignName": "tan thanh"
        },
        {
            "name": "Côn Đảo",
            "type": "Huyện",
            "provinceId": "77",
            "usignName": "con dao"
        },
        {
            "name": "Quận 1",
            "type": "Quận",
            "provinceId": "79",
            "usignName": "quan 1"
        },
        {
            "name": "Quận 12",
            "type": "Quận",
            "provinceId": "79",
            "usignName": "quan 12"
        },
        {
            "name": "Thủ Đức",
            "type": "Quận",
            "provinceId": "79",
            "usignName": "thu duc"
        },
        {
            "name": "Quận 9",
            "type": "Quận",
            "provinceId": "79",
            "usignName": "quan 9"
        },
        {
            "name": "Gò Vấp",
            "type": "Quận",
            "provinceId": "79",
            "usignName": "go vap"
        },
        {
            "name": "Bình Thạnh",
            "type": "Quận",
            "provinceId": "79",
            "usignName": "binh thanh"
        },
        {
            "name": "Tân Bình",
            "type": "Quận",
            "provinceId": "79",
            "usignName": "tan binh"
        },
        {
            "name": "Tân Phú",
            "type": "Quận",
            "provinceId": "79",
            "usignName": "tan phu"
        },
        {
            "name": "Phú Nhuận",
            "type": "Quận",
            "provinceId": "79",
            "usignName": "phu nhuan"
        },
        {
            "name": "Quận 2",
            "type": "Quận",
            "provinceId": "79",
            "usignName": "quan 2"
        },
        {
            "name": "Quận 3",
            "type": "Quận",
            "provinceId": "79",
            "usignName": "quan 3"
        },
        {
            "name": "Quận 10",
            "type": "Quận",
            "provinceId": "79",
            "usignName": "quan 10"
        },
        {
            "name": "Quận 11",
            "type": "Quận",
            "provinceId": "79",
            "usignName": "quan 11"
        },
        {
            "name": "Quận 4",
            "type": "Quận",
            "provinceId": "79",
            "usignName": "quan 4"
        },
        {
            "name": "Quận 5",
            "type": "Quận",
            "provinceId": "79",
            "usignName": "quan 5"
        },
        {
            "name": "Quận 6",
            "type": "Quận",
            "provinceId": "79",
            "usignName": "quan 6"
        },
        {
            "name": "Quận 8",
            "type": "Quận",
            "provinceId": "79",
            "usignName": "quan 8"
        },
        {
            "name": "Bình Tân",
            "type": "Quận",
            "provinceId": "79",
            "usignName": "binh tan"
        },
        {
            "name": "Quận 7",
            "type": "Quận",
            "provinceId": "79",
            "usignName": "quan 7"
        },
        {
            "name": "Củ Chi",
            "type": "Huyện",
            "provinceId": "79",
            "usignName": "cu chi"
        },
        {
            "name": "Hóc Môn",
            "type": "Huyện",
            "provinceId": "79",
            "usignName": "hoc mon"
        },
        {
            "name": "Bình Chánh",
            "type": "Huyện",
            "provinceId": "79",
            "usignName": "binh chanh"
        },
        {
            "name": "Nhà Bè",
            "type": "Huyện",
            "provinceId": "79",
            "usignName": "nha be"
        },
        {
            "name": "Cần Giờ",
            "type": "Huyện",
            "provinceId": "79",
            "usignName": "can gio"
        },
        {
            "name": "Tân An",
            "type": "Thành Phố",
            "provinceId": "80",
            "usignName": "tan an"
        },
        {
            "name": "Tân Hưng",
            "type": "Huyện",
            "provinceId": "80",
            "usignName": "tan hung"
        },
        {
            "name": "Vĩnh Hưng",
            "type": "Huyện",
            "provinceId": "80",
            "usignName": "vinh hung"
        },
        {
            "name": "Mộc Hóa",
            "type": "Huyện",
            "provinceId": "80",
            "usignName": "moc hoa"
        },
        {
            "name": "Tân Thạnh",
            "type": "Huyện",
            "provinceId": "80",
            "usignName": "tan thanh"
        },
        {
            "name": "Thạnh Hóa",
            "type": "Huyện",
            "provinceId": "80",
            "usignName": "thanh hoa"
        },
        {
            "name": "Đức Huệ",
            "type": "Huyện",
            "provinceId": "80",
            "usignName": "duc hue"
        },
        {
            "name": "Đức Hòa",
            "type": "Huyện",
            "provinceId": "80",
            "usignName": "duc hoa"
        },
        {
            "name": "Bến Lức",
            "type": "Huyện",
            "provinceId": "80",
            "usignName": "ben luc"
        },
        {
            "name": "Thủ Thừa",
            "type": "Huyện",
            "provinceId": "80",
            "usignName": "thu thua"
        },
        {
            "name": "Tân Trụ",
            "type": "Huyện",
            "provinceId": "80",
            "usignName": "tan tru"
        },
        {
            "name": "Cần Đước",
            "type": "Huyện",
            "provinceId": "80",
            "usignName": "can duoc"
        },
        {
            "name": "Cần Giuộc",
            "type": "Huyện",
            "provinceId": "80",
            "usignName": "can giuoc"
        },
        {
            "name": "Châu Thành",
            "type": "Huyện",
            "provinceId": "80",
            "usignName": "chau thanh"
        },
        {
            "name": "Mỹ Tho",
            "type": "Thành Phố",
            "provinceId": "82",
            "usignName": "my tho"
        },
        {
            "name": "Gò Công",
            "type": "Thị Xã",
            "provinceId": "82",
            "usignName": "go cong"
        },
        {
            "name": "Tân Phước",
            "type": "Huyện",
            "provinceId": "82",
            "usignName": "tan phuoc"
        },
        {
            "name": "Cái Bè",
            "type": "Huyện",
            "provinceId": "82",
            "usignName": "cai be"
        },
        {
            "name": "Cai Lậy",
            "type": "Huyện",
            "provinceId": "82",
            "usignName": "cai lay"
        },
        {
            "name": "Châu Thành",
            "type": "Huyện",
            "provinceId": "82",
            "usignName": "chau thanh"
        },
        {
            "name": "Chợ Gạo",
            "type": "Huyện",
            "provinceId": "82",
            "usignName": "cho gao"
        },
        {
            "name": "Gò Công Tây",
            "type": "Huyện",
            "provinceId": "82",
            "usignName": "go cong tay"
        },
        {
            "name": "Gò Công Đông",
            "type": "Huyện",
            "provinceId": "82",
            "usignName": "go cong dong"
        },
        {
            "name": "Tân Phú Đông",
            "type": "Huyện",
            "provinceId": "82",
            "usignName": "tan phu dong"
        },
        {
            "name": "Bến Tre",
            "type": "Thành Phố",
            "provinceId": "83",
            "usignName": "ben tre"
        },
        {
            "name": "Châu Thành",
            "type": "Huyện",
            "provinceId": "83",
            "usignName": "chau thanh"
        },
        {
            "name": "Chợ Lách",
            "type": "Huyện",
            "provinceId": "83",
            "usignName": "cho lach"
        },
        {
            "name": "Mỏ Cày Nam",
            "type": "Huyện",
            "provinceId": "83",
            "usignName": "mo cay nam"
        },
        {
            "name": "Giồng Trôm",
            "type": "Huyện",
            "provinceId": "83",
            "usignName": "giong trom"
        },
        {
            "name": "Bình Đại",
            "type": "Huyện",
            "provinceId": "83",
            "usignName": "binh dai"
        },
        {
            "name": "Ba Tri",
            "type": "Huyện",
            "provinceId": "83",
            "usignName": "ba tri"
        },
        {
            "name": "Thạnh Phú",
            "type": "Huyện",
            "provinceId": "83",
            "usignName": "thanh phu"
        },
        {
            "name": "Mỏ Cày Bắc",
            "type": "Huyện",
            "provinceId": "83",
            "usignName": "mo cay bac"
        },
        {
            "name": "Trà Vinh",
            "type": "Thị Xã",
            "provinceId": "84",
            "usignName": "tra vinh"
        },
        {
            "name": "Càng Long",
            "type": "Huyện",
            "provinceId": "84",
            "usignName": "cang long"
        },
        {
            "name": "Cầu Kè",
            "type": "Huyện",
            "provinceId": "84",
            "usignName": "cau ke"
        },
        {
            "name": "Tiểu Cần",
            "type": "Huyện",
            "provinceId": "84",
            "usignName": "tieu can"
        },
        {
            "name": "Châu Thành",
            "type": "Huyện",
            "provinceId": "84",
            "usignName": "chau thanh"
        },
        {
            "name": "Cầu Ngang",
            "type": "Huyện",
            "provinceId": "84",
            "usignName": "cau ngang"
        },
        {
            "name": "Trà Cú",
            "type": "Huyện",
            "provinceId": "84",
            "usignName": "tra cu"
        },
        {
            "name": "Duyên Hải",
            "type": "Huyện",
            "provinceId": "84",
            "usignName": "duyen hai"
        },
        {
            "name": "Vĩnh Long",
            "type": "Thành Phố",
            "provinceId": "86",
            "usignName": "vinh long"
        },
        {
            "name": "Long Hồ",
            "type": "Huyện",
            "provinceId": "86",
            "usignName": "long ho"
        },
        {
            "name": "Mang Thít",
            "type": "Huyện",
            "provinceId": "86",
            "usignName": "mang thit"
        },
        {
            "name": "Vũng Liêm",
            "type": "Huyện",
            "provinceId": "86",
            "usignName": "vung liem"
        },
        {
            "name": "Tam Bình",
            "type": "Huyện",
            "provinceId": "86",
            "usignName": "tam binh"
        },
        {
            "name": "Bình Minh",
            "type": "Huyện",
            "provinceId": "86",
            "usignName": "binh minh"
        },
        {
            "name": "Trà Ôn",
            "type": "Huyện",
            "provinceId": "86",
            "usignName": "tra on"
        },
        {
            "name": "Bình Tân",
            "type": "Huyện",
            "provinceId": "86",
            "usignName": "binh tan"
        },
        {
            "name": "Cao Lãnh",
            "type": "Thành Phố",
            "provinceId": "87",
            "usignName": "cao lanh"
        },
        {
            "name": "Sa Đéc",
            "type": "Thị Xã",
            "provinceId": "87",
            "usignName": "sa dec"
        },
        {
            "name": "Hồng Ngự",
            "type": "Thị Xã",
            "provinceId": "87",
            "usignName": "hong ngu"
        },
        {
            "name": "Tân Hồng",
            "type": "Huyện",
            "provinceId": "87",
            "usignName": "tan hong"
        },
        {
            "name": "Tam Nông",
            "type": "Huyện",
            "provinceId": "87",
            "usignName": "tam nong"
        },
        {
            "name": "Tháp Mười",
            "type": "Huyện",
            "provinceId": "87",
            "usignName": "thap muoi"
        },
        {
            "name": "Thanh Bình",
            "type": "Huyện",
            "provinceId": "87",
            "usignName": "thanh binh"
        },
        {
            "name": "Lấp Vò",
            "type": "Huyện",
            "provinceId": "87",
            "usignName": "lap vo"
        },
        {
            "name": "Lai Vung",
            "type": "Huyện",
            "provinceId": "87",
            "usignName": "lai vung"
        },
        {
            "name": "Châu Thành",
            "type": "Huyện",
            "provinceId": "87",
            "usignName": "chau thanh"
        },
        {
            "name": "Long Xuyên",
            "type": "Thành Phố",
            "provinceId": "89",
            "usignName": "long xuyen"
        },
        {
            "name": "Châu Đốc",
            "type": "Thị Xã",
            "provinceId": "89",
            "usignName": "chau doc"
        },
        {
            "name": "An Phú",
            "type": "Huyện",
            "provinceId": "89",
            "usignName": "an phu"
        },
        {
            "name": "Tân Châu",
            "type": "Thị Xã",
            "provinceId": "89",
            "usignName": "tan chau"
        },
        {
            "name": "Phú Tân",
            "type": "Huyện",
            "provinceId": "89",
            "usignName": "phu tan"
        },
        {
            "name": "Châu Phú",
            "type": "Huyện",
            "provinceId": "89",
            "usignName": "chau phu"
        },
        {
            "name": "Tịnh Biên",
            "type": "Huyện",
            "provinceId": "89",
            "usignName": "tinh bien"
        },
        {
            "name": "Tri Tôn",
            "type": "Huyện",
            "provinceId": "89",
            "usignName": "tri ton"
        },
        {
            "name": "Châu Thành",
            "type": "Huyện",
            "provinceId": "89",
            "usignName": "chau thanh"
        },
        {
            "name": "Chợ Mới",
            "type": "Huyện",
            "provinceId": "89",
            "usignName": "cho moi"
        },
        {
            "name": "Thoại Sơn",
            "type": "Huyện",
            "provinceId": "89",
            "usignName": "thoai son"
        },
        {
            "name": "Rạch Giá",
            "type": "Thành Phố",
            "provinceId": "91",
            "usignName": "rach gia"
        },
        {
            "name": "Hà Tiên",
            "type": "Thị Xã",
            "provinceId": "91",
            "usignName": "ha tien"
        },
        {
            "name": "Kiên Lương",
            "type": "Huyện",
            "provinceId": "91",
            "usignName": "kien luong"
        },
        {
            "name": "Hòn Đất",
            "type": "Huyện",
            "provinceId": "91",
            "usignName": "hon dat"
        },
        {
            "name": "Tân Hiệp",
            "type": "Huyện",
            "provinceId": "91",
            "usignName": "tan hiep"
        },
        {
            "name": "Châu Thành",
            "type": "Huyện",
            "provinceId": "91",
            "usignName": "chau thanh"
        },
        {
            "name": "Giồng Giềng",
            "type": "Huyện",
            "provinceId": "91",
            "usignName": "giong gieng"
        },
        {
            "name": "Gò Quao",
            "type": "Huyện",
            "provinceId": "91",
            "usignName": "go quao"
        },
        {
            "name": "An Biên",
            "type": "Huyện",
            "provinceId": "91",
            "usignName": "an bien"
        },
        {
            "name": "An Minh",
            "type": "Huyện",
            "provinceId": "91",
            "usignName": "an minh"
        },
        {
            "name": "Vĩnh Thuận",
            "type": "Huyện",
            "provinceId": "91",
            "usignName": "vinh thuan"
        },
        {
            "name": "Phú Quốc",
            "type": "Huyện",
            "provinceId": "91",
            "usignName": "phu quoc"
        },
        {
            "name": "Kiên Hải",
            "type": "Huyện",
            "provinceId": "91",
            "usignName": "kien hai"
        },
        {
            "name": "U Minh Thượng",
            "type": "Huyện",
            "provinceId": "91",
            "usignName": "u minh thuong"
        },
        {
            "name": "Giang Thành",
            "type": "Huyện",
            "provinceId": "91",
            "usignName": "giang thanh"
        },
        {
            "name": "Ninh Kiều",
            "type": "Quận",
            "provinceId": "92",
            "usignName": "ninh kieu"
        },
        {
            "name": "Ô Môn",
            "type": "Quận",
            "provinceId": "92",
            "usignName": "o mon"
        },
        {
            "name": "Bình Thuỷ",
            "type": "Quận",
            "provinceId": "92",
            "usignName": "binh thuy"
        },
        {
            "name": "Cái Răng",
            "type": "Quận",
            "provinceId": "92",
            "usignName": "cai rang"
        },
        {
            "name": "Thốt Nốt",
            "type": "Quận",
            "provinceId": "92",
            "usignName": "thot not"
        },
        {
            "name": "Vĩnh Thạnh",
            "type": "Huyện",
            "provinceId": "92",
            "usignName": "vinh thanh"
        },
        {
            "name": "Cờ Đỏ",
            "type": "Huyện",
            "provinceId": "92",
            "usignName": "co do"
        },
        {
            "name": "Phong Điền",
            "type": "Huyện",
            "provinceId": "92",
            "usignName": "phong dien"
        },
        {
            "name": "Thới Lai",
            "type": "Huyện",
            "provinceId": "92",
            "usignName": "thoi lai"
        },
        {
            "name": "Vị Thanh",
            "type": "Thị Xã",
            "provinceId": "93",
            "usignName": "vi thanh"
        },
        {
            "name": "Ngã Bảy",
            "type": "Thị Xã",
            "provinceId": "93",
            "usignName": "nga bay"
        },
        {
            "name": "Châu Thành A",
            "type": "Huyện",
            "provinceId": "93",
            "usignName": "chau thanh a"
        },
        {
            "name": "Châu Thành",
            "type": "Huyện",
            "provinceId": "93",
            "usignName": "chau thanh"
        },
        {
            "name": "Phụng Hiệp",
            "type": "Huyện",
            "provinceId": "93",
            "usignName": "phung hiep"
        },
        {
            "name": "Vị Thuỷ",
            "type": "Huyện",
            "provinceId": "93",
            "usignName": "vi thuy"
        },
        {
            "name": "Long Mỹ",
            "type": "Huyện",
            "provinceId": "93",
            "usignName": "long my"
        },
        {
            "name": "Sóc Trăng",
            "type": "Thành Phố",
            "provinceId": "94",
            "usignName": "soc trang"
        },
        {
            "name": "Châu Thành",
            "type": "Huyện",
            "provinceId": "94",
            "usignName": "chau thanh"
        },
        {
            "name": "Kế Sách",
            "type": "Huyện",
            "provinceId": "94",
            "usignName": "ke sach"
        },
        {
            "name": "Mỹ Tú",
            "type": "Huyện",
            "provinceId": "94",
            "usignName": "my tu"
        },
        {
            "name": "Cù Lao Dung",
            "type": "Huyện",
            "provinceId": "94",
            "usignName": "cu lao dung"
        },
        {
            "name": "Long Phú",
            "type": "Huyện",
            "provinceId": "94",
            "usignName": "long phu"
        },
        {
            "name": "Mỹ Xuyên",
            "type": "Huyện",
            "provinceId": "94",
            "usignName": "my xuyen"
        },
        {
            "name": "Ngã Năm",
            "type": "Huyện",
            "provinceId": "94",
            "usignName": "nga nam"
        },
        {
            "name": "Thạnh Trị",
            "type": "Huyện",
            "provinceId": "94",
            "usignName": "thanh tri"
        },
        {
            "name": "Vĩnh Châu",
            "type": "Huyện",
            "provinceId": "94",
            "usignName": "vinh chau"
        },
        {
            "name": "Trần Đề",
            "type": "Huyện",
            "provinceId": "94",
            "usignName": "tran de"
        },
        {
            "name": "Bạc Liêu",
            "type": "Thị Xã",
            "provinceId": "95",
            "usignName": "bac lieu"
        },
        {
            "name": "Hồng Dân",
            "type": "Huyện",
            "provinceId": "95",
            "usignName": "hong dan"
        },
        {
            "name": "Phước Long",
            "type": "Huyện",
            "provinceId": "95",
            "usignName": "phuoc long"
        },
        {
            "name": "Vĩnh Lợi",
            "type": "Huyện",
            "provinceId": "95",
            "usignName": "vinh loi"
        },
        {
            "name": "Giá Rai",
            "type": "Huyện",
            "provinceId": "95",
            "usignName": "gia rai"
        },
        {
            "name": "Đông Hải",
            "type": "Huyện",
            "provinceId": "95",
            "usignName": "dong hai"
        },
        {
            "name": "Hoà Bình",
            "type": "Huyện",
            "provinceId": "95",
            "usignName": "hoa binh"
        },
        {
            "name": "Cà Mau",
            "type": "Thành Phố",
            "provinceId": "96",
            "usignName": "ca mau"
        },
        {
            "name": "U Minh",
            "type": "Huyện",
            "provinceId": "96",
            "usignName": "u minh"
        },
        {
            "name": "Thới Bình",
            "type": "Huyện",
            "provinceId": "96",
            "usignName": "thoi binh"
        },
        {
            "name": "Trần Văn Thời",
            "type": "Huyện",
            "provinceId": "96",
            "usignName": "tran van thoi"
        },
        {
            "name": "Cái Nước",
            "type": "Huyện",
            "provinceId": "96",
            "usignName": "cai nuoc"
        },
        {
            "name": "Đầm Dơi",
            "type": "Huyện",
            "provinceId": "96",
            "usignName": "dam doi"
        },
        {
            "name": "Năm Căn",
            "type": "Huyện",
            "provinceId": "96",
            "usignName": "nam can"
        },
        {
            "name": "Phú Tân",
            "type": "Huyện",
            "provinceId": "96",
            "usignName": "phu tan"
        },
        {
            "name": "Ngọc Hiển",
            "type": "Huyện",
            "provinceId": "96",
            "usignName": "ngoc hien"
        },
        {
            "name": ""
        }
    ];

    let dropProvince = function () {
        const deferred = Q.defer();

        Province.remove({}, function (error) {
            if (error) {
                console.error(error);
                deferred.reject(
                    new errors.InvalidContentError(error.message)
                );
            } else {
                deferred.resolve(true);
            }
        });

        return deferred.promise;
    };

    let dropDistrict = function () {
        const deferred = Q.defer();

        District.remove({}, function (error) {
            if (error) {
                console.error(error);
                deferred.reject(
                    new errors.InvalidContentError(error.message)
                );
            } else {
                deferred.resolve(true);
            }
        });

        return deferred.promise;
    };


    Promise.all([dropProvince(), dropDistrict()]).then(function (results) {
        Province.insertMany(provinceArr)
            .then((result) => {
                // console.log("result ", result);
            })
            .catch(err => {
                console.error("error ", err);
            });

        District.insertMany(districtArr)
            .then((result) => {
                // console.log("result ", result);
            })
            .catch(err => {
                console.error("error ", err);
            });
    });

    // const workSheetsFromFile = parseExcel.parse(config.root_dir + '/dev/province.xlsx');
    // // console.log(workSheetsFromFile[0].data[1]);
    // let provinceList = workSheetsFromFile[0].data;
    // // for(let key in provinceList)
    // // {
    // //     console.log(key);
    // // }
    //
    // let provinceArr = [];
    // let provinceItem = {};
    // _.forEach(provinceList, function (item, index) {
    //     provinceItem = {provinceId: item[0], name: item[1], type: item[2], unsignName: item[3]};
    //     provinceArr.push(provinceItem);
    // });
    //
    // console.log(provinceArr);
});

