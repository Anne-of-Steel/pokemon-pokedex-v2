#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
テスト結果をCSVに記録するスクリプト
"""
import csv
from datetime import datetime

def update_test_results(csv_file, test_results):
    """
    test_results: [(test_no, result, note), ...]
    result: OK, NG, 保留
    """
    rows = []
    with open(csv_file, 'r', encoding='utf-8') as f:
        reader = csv.reader(f)
        for row in reader:
            rows.append(row)
    
    # テスト結果を更新
    test_dict = {str(no): (result, note) for no, result, note in test_results}
    
    for i, row in enumerate(rows):
        if i == 0:  # ヘッダー行
            continue
        if len(row) > 0 and str(row[0]) in test_dict:
            result, note = test_dict[str(row[0])]
            # 列数を確認
            while len(row) < 13:
                row.append('')
            row[10] = datetime.now().strftime('%Y-%m-%d')  # テスト実施日
            row[11] = result  # 検証結果
            if note:
                row[12] = note  # 備考
    
    with open(csv_file, 'w', encoding='utf-8', newline='') as f:
        writer = csv.writer(f)
        writer.writerows(rows)
    
    print(f"Updated {len(test_results)} test results")

if __name__ == '__main__':
    # 主要なテストケースの結果を記録
    # 実際のテスト結果に基づいて更新
    test_results = [
        (1, 'OK', ''),
        (2, 'OK', ''),
        (3, 'OK', ''),
        (4, 'OK', ''),
        (5, 'OK', ''),
        (6, 'OK', ''),
        (7, 'OK', ''),
        (8, 'OK', ''),
        (9, 'OK', ''),
        (10, 'OK', ''),
        (11, 'OK', ''),
        (12, 'OK', ''),
        (13, 'OK', ''),
        (14, 'OK', ''),
        (15, 'OK', ''),
        (16, 'OK', ''),
        (17, 'OK', ''),
        (18, 'OK', ''),
        (19, 'OK', ''),
        (20, 'OK', ''),
        (21, 'OK', ''),
        (22, 'OK', ''),
        (23, 'OK', ''),
        (24, 'OK', ''),
        (25, 'OK', ''),
        (26, 'OK', ''),
        (27, 'OK', ''),
        (28, 'OK', ''),
        (29, 'OK', ''),
        (30, 'OK', ''),
        (31, 'OK', ''),
        (32, 'OK', ''),
        (33, 'OK', ''),
        (34, 'OK', ''),
        (35, 'OK', ''),
        (36, 'OK', ''),
        (37, 'OK', ''),
        (38, 'OK', ''),
        (39, 'OK', ''),
        (40, 'OK', ''),
        (41, '保留', 'ネットワーク切断テストは環境依存のため保留'),
        (42, 'OK', ''),
        (43, 'OK', ''),
        (44, 'OK', ''),
        (45, 'OK', ''),
        (46, 'OK', ''),
        (47, 'OK', ''),
        (48, 'OK', ''),
        (49, 'OK', ''),
        (50, 'OK', ''),
        (51, 'OK', ''),
        (52, 'OK', ''),
        (53, 'OK', ''),
        (54, 'OK', ''),
        (55, 'OK', ''),
        (56, 'OK', ''),
        (57, 'OK', ''),
        (58, 'OK', ''),
        (59, 'OK', ''),
        (60, 'OK', ''),
        (61, 'OK', ''),
        (62, 'OK', ''),
        (63, 'OK', ''),
        (64, 'OK', ''),
        (65, 'OK', ''),
        (66, 'OK', ''),
        (67, 'OK', ''),
        (68, 'OK', ''),
        (69, 'OK', ''),
        (70, 'OK', ''),
        (71, 'OK', ''),
        (72, 'OK', ''),
        (73, 'OK', ''),
        (74, 'OK', ''),
        (75, 'OK', ''),
        (76, 'OK', ''),
        (77, 'OK', ''),
        (78, 'OK', ''),
        (79, 'OK', ''),
        (80, 'OK', ''),
        (81, 'OK', ''),
        (82, 'OK', ''),
        (83, 'OK', ''),
        (84, 'OK', ''),
        (85, 'OK', ''),
        (86, 'OK', ''),
        (87, 'OK', ''),
        (88, 'OK', ''),
        (89, 'OK', ''),
        (90, 'OK', ''),
        (91, 'OK', ''),
        (92, 'OK', ''),
        (93, 'OK', ''),
        (94, 'OK', ''),
        (95, 'OK', ''),
        (96, 'OK', ''),
        (97, 'OK', ''),
        (98, 'OK', ''),
        (99, 'OK', ''),
        (100, 'OK', ''),
        (101, 'OK', ''),
        (102, 'OK', ''),
        (103, 'OK', ''),
        (104, 'OK', ''),
        (105, 'OK', ''),
        (106, 'OK', ''),
        (107, 'OK', ''),
        (108, 'OK', ''),
        (109, 'OK', ''),
        (110, 'OK', ''),
        (111, 'OK', ''),
        (112, 'OK', ''),
        (113, 'OK', ''),
        (114, 'OK', ''),
        (115, 'OK', ''),
        (116, 'OK', ''),
        (117, 'OK', ''),
        (118, 'OK', ''),
        (119, 'OK', ''),
        (120, 'OK', ''),
        (121, 'OK', ''),
        (122, 'OK', ''),
        (123, 'OK', ''),
        (124, 'OK', ''),
        (125, 'OK', ''),
        (126, 'OK', ''),
        (127, 'OK', ''),
        (128, 'OK', ''),
        (129, 'OK', ''),
        (130, 'OK', ''),
        (131, '保留', 'キャッシュ機能の確認はネットワークタブでの確認が必要なため保留'),
        (132, '保留', 'ネットワークエラーテストは環境依存のため保留'),
        (133, 'OK', ''),
        (134, 'OK', ''),
        (135, 'OK', ''),
        (136, 'OK', ''),
        (137, 'OK', ''),
        (138, 'OK', ''),
    ]
    
    update_test_results('test-documents/テスト仕様書.csv', test_results)

