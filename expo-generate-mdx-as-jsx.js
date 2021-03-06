const fs = require('fs');
const mdx = require('@mdx-js/mdx');
const glob = require('glob');
const grayMatter = require('gray-matter');

const Encoding = 'utf8';

// Copy of gatsby mdx plugin, also extracting frontmatter variable
// https://github.com/gatsbyjs/gatsby/blob/561d33e2e491d3971cb2a404eec9705a5a493602/packages/gatsby-plugin-mdx/utils/mdx.js
const toJSX = (source) => {
  const { data, content } = grayMatter(source);

  const code = mdx.sync(content);

  return `${code}
export const frontmatter = ${JSON.stringify(data)};
`;
};

// Regular mdx add images with path as string, but RN needs require("imagePath") to work...
const imageSrcToRequire = (jsx) => {
  return jsx.replace(
    /"(src|hero)": ?("(\\"|[^"])*\.(jpg|jpeg|png)")/g,
    (match, attribute, value) => {
      //console.log('replace ' + match + '    ===>>>   ' + attribute + '=' + value);
      const newValue = `"${attribute}":require(${value})`;
      //console.log('replace ' + match + '    ===>>>   ' + newValue);
      return newValue;
    },
  );
};

const mdxFiles = glob.sync('./content/**/*.mdx');
console.log('Generating JSX files from MDX articles');

const jsxFiles = mdxFiles.map((mdxFile) => {
  const mdxText = fs.readFileSync(mdxFile, Encoding);
  // pragma will be added just after, including the import
  const jsxText = imageSrcToRequire(toJSX(mdxText)).replace(
    '/* @jsx mdx */',
    '',
  );

  const jsx = `
/* @jsx mdx */
import { mdx } from '@mdx-js/react';

${jsxText}
`;

  const outputFile = mdxFile + '.jsx';
  fs.writeFileSync(outputFile, jsx, Encoding);
  return outputFile;
});

console.log(jsxFiles);

const blogPostListFileContent = `export default [
${jsxFiles
  .map((jsxFile) => {
    return `  require('${jsxFile}')`;
  })
  .join(',\n')},
];
`;

fs.writeFileSync(
  './AppBlogPostList.generated.tsx',
  blogPostListFileContent,
  Encoding,
);
