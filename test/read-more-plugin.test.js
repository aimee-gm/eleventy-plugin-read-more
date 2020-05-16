const { expect } = require("chai");
const sinon = require("sinon");

const plugin = require("../.eleventy");

const stubs = {
  addFilter: sinon.stub(),
  addPairedShortcode: sinon.stub(),
};

const eleventy = { addPlugin: (p, config) => p.configFunction(stubs, config) };

describe("eleventy-read-more-plugin", () => {
  beforeEach(() => {
    sinon.reset();
  });

  describe("setup", () => {
    it("should register the filters", () => {
      eleventy.addPlugin(plugin);
      expect(stubs.addFilter.callCount).to.equal(2);
      expect(stubs.addFilter.firstCall.args[0]).to.equal("excerpt");
      expect(stubs.addFilter.secondCall.args[0]).to.equal("hasMoretag");
    });

    it("should register the shortcode", () => {
      eleventy.addPlugin(plugin);
      expect(stubs.addPairedShortcode.callCount).to.equal(1);
      expect(stubs.addPairedShortcode.firstCall.args[0]).to.equal("readMore");
    });
  });

  describe("default settings", () => {
    describe("excerpt", () => {
      it("should return the text before <!--more-->", () => {
        const content = "A short summary<!--more-->The full story";
        eleventy.addPlugin(plugin);
        const fn = stubs.addFilter.firstCall.args[1];

        expect(fn(content)).to.equal("A short summary");
        expect(fn("A short summary")).to.equal("A short summary");
      });
    });

    describe("hasMoretag", () => {
      it("should return true if the text contains <!--more-->", () => {
        const content = "A short summary<!--more-->The full story";
        eleventy.addPlugin(plugin);
        const fn = stubs.addFilter.secondCall.args[1];

        expect(fn(content)).to.equal(true);
        expect(fn("A short summary")).to.equal(false);
        expect(fn("<!--read-more-->")).to.equal(false);
      });
    });

    describe("readMore", () => {
      it("should return true if the text contains <!--more-->", () => {
        const content = "A short summary<!--more-->The full story";
        eleventy.addPlugin(plugin);
        const fn = stubs.addPairedShortcode.firstCall.args[1];

        expect(fn('<a href="/">My link</a>', content)).to.equal(
          'A short summary <a href="/">My link</a>'
        );

        expect(fn('<a href="/">My link</a>', "A short summary")).to.equal(
          "A short summary"
        );
      });
    });
  });

  describe("with custom settings", () => {
    const options = { readMoreTag: "<!--read-more-->" };

    describe("excerpt", () => {
      it("should return the text before <!--read-more-->", () => {
        const content = "A short summary<!--read-more-->The full story";
        eleventy.addPlugin(plugin, options);
        const fn = stubs.addFilter.firstCall.args[1];

        expect(fn(content)).to.equal("A short summary");
        expect(fn("A short summary")).to.equal("A short summary");
      });
    });

    describe("hasMoretag", () => {
      it("should return true if the text contains <!--read-more-->", () => {
        const content = "A short summary<!--more-->The full story";
        eleventy.addPlugin(plugin, options);
        const fn = stubs.addFilter.secondCall.args[1];

        expect(fn(content)).to.equal(false);
        expect(fn("A short summary")).to.equal(false);
        expect(fn("<!--read-more-->")).to.equal(true);
      });
    });

    describe("readMore", () => {
      it("should return true if the text contains <!--read-more-->", () => {
        const content = "A short summary<!--read-more-->The full story";
        eleventy.addPlugin(plugin, options);
        const fn = stubs.addPairedShortcode.firstCall.args[1];

        expect(fn('<a href="/">My link</a>', content)).to.equal(
          'A short summary <a href="/">My link</a>'
        );

        expect(fn('<a href="/">My link</a>', "A short summary")).to.equal(
          "A short summary"
        );
      });
    });
  });
});
