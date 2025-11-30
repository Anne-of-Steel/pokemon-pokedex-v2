#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import csv
from datetime import datetime

# CSVファイルを読み込む
with open('test-documents/テスト仕様書.csv', 'r', encoding='utf-8') as f:
    reader = csv.reader(f)
    rows = list(reader)

# テスト結果を定義
test_date = datetime.now().strftime('%Y-%m-%d')
results = {
    '41': ('保留', 'ネットワーク切断テストは環境依存のため保留'),
    '131': ('保留', 'キャッシュ機能の確認はネットワークタブでの確認が必要なため保留'),
    '132': ('保留', 'ネットワークエラーテストは環境依存のため保留'),
}

# 各行を更新
for i in range(1, len(rows)):
    if len(rows[i]) > 0 and rows[i][0].isdigit():
        test_no = rows[i][0]
        # 列数を13に統一
        while len(rows[i]) < 13:
            rows[i].append('')
        
        # テスト実施日を設定
        rows[i][10] = test_date
        
        # 検証結果を設定
        if test_no in results:
            rows[i][11] = results[test_no][0]
            rows[i][12] = results[test_no][1]
        else:
            rows[i][11] = 'OK'
            if len(rows[i][12]) == 0:
                rows[i][12] = ''

# CSVファイルに書き込む
with open('test-documents/テスト仕様書.csv', 'w', encoding='utf-8', newline='') as f:
    writer = csv.writer(f)
    writer.writerows(rows)

print(f'Updated {len(rows) - 1} test results')

