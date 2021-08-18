import { expect } from "chai";
import * as mocha from "mocha";
import * as path from "path";
import { window, workspace } from "vscode";
import { Command } from "../../../src/command";
import { editorFile2, targetFile, tmpDir } from "../environment";
import { closeAllEditors, readFile } from "../functions";
import {
    createShowInformationMessageStub,
    createShowInputBoxStub,
    restoreShowInformationMessage,
    restoreShowInputBox,
} from "../stubs";
import { FuncVoid, Step } from "./types";

export const describe: Step = {
    "with target file in non-existent nested directory"(subject: Command): FuncVoid {
        return () => {
            const targetDir = path.resolve(tmpDir.fsPath, "level-1", "level-2", "level-3");

            mocha.beforeEach(async () => createShowInputBoxStub().resolves(path.resolve(targetDir, "file.rb")));

            mocha.it("should create nested directories", async () => {
                await subject.execute();
                const textEditor = window.activeTextEditor;
                expect(textEditor);

                const dirname = path.dirname(textEditor?.document.fileName ?? "");
                const directories: string[] = dirname.split(path.sep);

                expect(directories.pop()).to.equal("level-3");
                expect(directories.pop()).to.equal("level-2");
                expect(directories.pop()).to.equal("level-1");
            });
        };
    },
    "when target destination exists"(subject: Command, config?: Record<string, unknown>): FuncVoid {
        return () => {
            mocha.beforeEach(async () => {
                await workspace.fs.copy(editorFile2, targetFile, { overwrite: true });
                createShowInformationMessageStub().resolves({ title: "placeholder" });
            });

            mocha.afterEach(async () => restoreShowInformationMessage());

            mocha.it("should prompt with confirmation dialog to overwrite destination file", async () => {
                await subject.execute();
                const message = `File '${targetFile.path}' already exists.`;
                const action = "Overwrite";
                const options = { modal: true };
                expect(window.showInformationMessage).to.have.been.calledWith(message, options, action);
            });

            mocha.describe('when answered with "Overwrite"', () => {
                mocha.it("should overwrite the existig file", async () => {
                    await subject.execute();
                    const fileContent = await readFile(targetFile);
                    const expectedFileContent =
                        config && "overwriteFileContent" in config ? config.overwriteFileContent : "class FileOne; end";
                    expect(fileContent).to.equal(expectedFileContent);
                });
            });

            mocha.describe('when answered with "Cancel"', () => {
                mocha.beforeEach(async () => createShowInformationMessageStub().resolves(false));

                mocha.it("should leave existing file untouched", async () => {
                    try {
                        await subject.execute();
                        expect.fail("must fail");
                    } catch (e) {
                        const fileContent = await readFile(targetFile);
                        expect(fileContent).to.equal("class FileTwo; end");
                    }
                });
            });
        };
    },
    "without an open text document"(subject: Command): FuncVoid {
        return () => {
            mocha.beforeEach(async () => {
                await closeAllEditors();
                createShowInputBoxStub();
            });

            mocha.afterEach(async () => restoreShowInputBox());

            mocha.it("should ignore the command call", async () => {
                try {
                    await subject.execute();
                    expect.fail("must fail");
                } catch {
                    expect(window.showInputBox).to.have.not.been.called;
                }
            });
        };
    },
};
