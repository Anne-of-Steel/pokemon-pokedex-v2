#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
テスト実行スクリプト
Playwright MCPの結果をCSVに記録するためのヘルパースクリプト
"""
import csv
import sys
from datetime import datetime

def update_test_result(csv_file, test_no, result, note=""):
    """
    テスト仕様書CSVの結果を更新
    result: OK, NG, 保留
    """
    rows = []
    with open(csv_file, 'r', encoding='utf-8') as f:
        reader = csv.reader(f)
        for row in reader:
            rows.append(row)
    
    # ヘッダー行をスキップして、テストNo.で検索
    for i, row in enumerate(rows):
        if i == 0:  # ヘッダー行
            continue
        if len(row) > 0 and str(row[0]) == str(test_no):
            # 検証結果と備考を更新
            if len(row) < 12:
                row.extend([''] * (12 - len(row)))
            row[11] = result  # 検証結果
            if note:
                row[12] = note  # 備考
            row[10] = datetime.now().strftime('%Y-%m-%d')  # テスト実施日
            break
    
    with open(csv_file, 'w', encoding='utf-8', newline='') as f:
        writer = csv.writer(f)
        writer.writerows(rows)

if __name__ == '__main__':
    if len(sys.argv) < 4:
        print("Usage: python test_runner.py <csv_file> <test_no> <result> [note]")
        sys.exit(1)
    
    csv_file = sys.argv[1]
    test_no = sys.argv[2]
    result = sys.argv[3]
    note = sys.argv[4] if len(sys.argv) > 4 else ""
    
    update_test_result(csv_file, test_no, result, note)
    print(f"Test {test_no} updated: {result}")

