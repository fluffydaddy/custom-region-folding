/*
 * Copyright 2024 fluffydaddy
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    const foldProvider: vscode.FoldingRangeProvider = {
        provideFoldingRanges(
            document: vscode.TextDocument,
            context: vscode.FoldingContext,
            token: vscode.CancellationToken
        ): vscode.ProviderResult<vscode.FoldingRange[]> {
            const foldingRanges: vscode.FoldingRange[] = [];
            
            let start: number | null = null;
            let regionName = '';

            for (let i = 0; i < document.lineCount; i++) {
                const line = document.lineAt(i).text;

                // Detect start of region
                const regionMatch = line.match(/^\s*#pragma\s+region\s+(.*)/);
                if (regionMatch) {
                    start = i;
                    regionName = regionMatch[1].trim(); // Get the region name after #pragma region
                }

                // Detect end of region
                const endRegionMatch = /^\s*#pragma\s+endregion/.test(line);
                if (start !== null && endRegionMatch) {
                    // Create a folding range from the start to the current line
                    const foldingRange = new vscode.FoldingRange(start, i, vscode.FoldingRangeKind.Region);
                    foldingRanges.push(foldingRange);
                    start = null; // Reset start for the next region
                }
            }

            return foldingRanges;
        }
    };

    // Register the folding provider for C++
    const disposable = vscode.languages.registerFoldingRangeProvider(
        { language: 'cpp', scheme: 'file' },
        foldProvider
    );

    context.subscriptions.push(disposable);
}

export function deactivate() {}