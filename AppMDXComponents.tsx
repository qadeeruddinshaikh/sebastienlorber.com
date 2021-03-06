// Copy of https://gist.github.com/danieldunderfelt/1982786761cf4156b732b3a128a8050f

import React, { ReactNode } from 'react';
import { Text, View, TextProps, Platform } from 'react-native';
import { Linking } from 'react-native';
import { StyleSheet } from 'react-native';
import AppImage from 'components/AppImage';
import { useColorMode } from 'theme/useColorMode';
import { useDimensions } from '@react-native-community/hooks';

const useIsLight = () => useColorMode()[0] === 'light';

function openUrl(url) {
  if (url) {
    Linking.openURL(url);
  }
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
  },
  root: {},
  view: {},
  imageContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  codeBlock: {
    // borderWidth: 1,
    fontSize: 12,
    padding: 10,
    marginBottom: 10,
    borderRadius: 4,
  },
  codeInline: {
    borderRadius: 4,
  },
  del: {
    backgroundColor: '#000000',
  },
  em: {
    fontStyle: 'italic',
  },
  headingContainer: {
    flexDirection: 'row',
  },
  heading: {},
  heading1: {
    fontSize: 32,
  },
  heading2: {
    fontSize: 24,
  },
  heading3: {
    fontSize: 18,
  },
  heading4: {
    fontSize: 16,
  },
  heading5: {
    fontSize: 13,
  },
  heading6: {
    fontSize: 11,
  },
  hr: {
    backgroundColor: 'grey',
    height: 1,
    marginVertical: 10,
  },
  blockquote: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginVertical: 20,
  },
  inlineCode: {
    borderRadius: 3,
    borderWidth: 1,
    fontFamily: 'Courier',
    fontWeight: 'bold',
  },
  list: {},
  listItem: {
    //marginVertical: 5,
    overflow: 'hidden',
  },
  listUnordered: {
    marginTop: 5,
    marginBottom: 15,
  },

  listUnorderedItem: {
    marginVertical: 3,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    // flexWrap: "wrap",
  },

  listUnorderedItemIcon: {
    marginLeft: 10,
    marginRight: 10,
    lineHeight: 30,
  },
  listUnorderedItemText: {
    fontSize: 20,
    lineHeight: 20,
  },

  listOrdered: {},
  listOrderedItem: {
    flexDirection: 'row',
  },
  listOrderedItemIcon: {
    marginLeft: 10,
    marginRight: 10,
    lineHeight: 30,
  },
  listOrderedItemText: {
    fontWeight: 'bold',
    lineHeight: 20,
  },
  div: {},
  paragraph: {
    marginTop: 10,
    marginBottom: 10,
    flexWrap: 'wrap',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  hardbreak: {
    width: '100%',
    height: 1,
  },
  strong: {
    fontWeight: 'bold',
  },
  table: {
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 3,
  },
  tableHeader: {},
  tableHeaderCell: {
    flex: 1,
    // color: '#000000',
    padding: 5,
    // backgroundColor: 'green',
  },
  tableRow: {
    borderBottomWidth: 1,
    borderColor: '#000000',
    flexDirection: 'row',
  },
  tableRowCell: {
    flex: 1,
    padding: 5,
  },
  strikethrough: {
    textDecorationLine: 'line-through',
  },
  pre: {},
  link: {
    textDecorationLine: 'underline',
    fontWeight: 'bold',
  },
  image: {
    width: 200,
    height: 200,
  },
});

const MDXText = (props: TextProps & { children?: ReactNode }) => {
  const themeStyle = useIsLight() ? { color: 'black' } : { color: 'white' };
  return <Text {...props} style={[themeStyle, props.style]} />;
};

const wrapInTextIfNeeded = (
  node: ReactNode,
  options: { key?: string } = {},
) => {
  /*
  console.debug('wrapInTextIfNeeded', {
    node,
    array: node instanceof Array,
    string: typeof node === 'string',
  });
   */
  if (node instanceof Array) {
    const hasOnlyTextNodes = node.every((n) => {
      if (typeof n === 'string') {
        return true;
      } else {
        // @ts-ignore
        const mdxType = n?.props?.mdxType ?? '';
        const textMdxTypes = ['inlineCode', 'a', 'strong'];
        //console.debug("node",{n});
        //console.debug('mdxType', n.props.mdxType);
        return textMdxTypes.includes(mdxType);
      }
    });

    if (hasOnlyTextNodes) {
      return <MDXText key={options.key}>{node}</MDXText>;
    } else {
      // We can't wrap here, because some nodes might be non-text (like inline images)
      return node.map((n, i) => wrapInTextIfNeeded(n, { key: `key_${i}` }));
    }
  } else if (typeof node === 'string') {
    return <MDXText key={options.key}>{node}</MDXText>;
  } else {
    return node;
  }
};

const AppMDXComponents = {
  div: ({ children }) => <View style={styles.div}>{children}</View>,
  wrapper: ({ children }) => <View style={styles.wrapper}>{children}</View>,
  textgroup: ({ children }) => {
    return <MDXText>{children}</MDXText>;
  },
  inline: ({ children }) => {
    return <MDXText>{children}</MDXText>;
  },
  text: ({ children }) => {
    return <MDXText>{children}</MDXText>;
  },
  span: ({ children }) => {
    return <MDXText>{children}</MDXText>;
  },
  strong: ({ children }) => {
    return <MDXText style={styles.strong}>{children}</MDXText>;
  },
  u: ({ children }) => {
    return <MDXText textDecorationLine="underline">{children}</MDXText>;
  },
  a: ({ href, children }) => {
    const webProps = { href, target: '_blank', rel: 'noopener' };
    return (
      <MDXText
        {...webProps}
        accessibilityRole="link"
        onPress={() => {
          if (Platform.OS !== 'web') {
            openUrl(href);
          }
        }}
        style={[
          styles.link,
          useIsLight() ? { color: '#6166DC' } : { color: '#E9DAAC' },
        ]}
      >
        {children}
      </MDXText>
    );
  },
  em: ({ children }) => {
    return <MDXText style={styles.em}>{children}</MDXText>;
  },
  h1: ({ children }) => {
    return (
      <View style={styles.headingContainer}>
        <MDXText style={[styles.heading, styles.heading1]}>{children}</MDXText>
      </View>
    );
  },
  h2: ({ children }) => {
    return (
      <View style={styles.headingContainer}>
        <MDXText style={[styles.heading, styles.heading2]}>{children}</MDXText>
      </View>
    );
  },
  h3: ({ children }) => (
    <View style={styles.headingContainer}>
      <MDXText style={[styles.heading, styles.heading3]}>{children}</MDXText>
    </View>
  ),
  h4: ({ children }) => (
    <View style={styles.headingContainer}>
      <MDXText style={[styles.heading, styles.heading4]}>{children}</MDXText>
    </View>
  ),
  h5: ({ children }) => (
    <View style={styles.headingContainer}>
      <MDXText style={[styles.heading, styles.heading5]}>{children}</MDXText>
    </View>
  ),
  h6: ({ children }) => (
    <View style={styles.headingContainer}>
      <MDXText style={[styles.heading, styles.heading6]}>{children}</MDXText>
    </View>
  ),
  p: ({ parentName, children }) => {
    return (
      <View style={parentName === 'blockquote' ? {} : [styles.paragraph]}>
        {wrapInTextIfNeeded(children)}
      </View>
    );
  },
  blockquote: ({ children }) => (
    <View
      style={[
        styles.blockquote,
        useIsLight()
          ? { backgroundColor: '#EEEEEE' }
          : { backgroundColor: '#404040' },
      ]}
    >
      {children}
    </View>
  ),
  inlineCode: ({ children }) => {
    return (
      <MDXText
        style={[
          styles.codeInline,
          useIsLight()
            ? { backgroundColor: '#EEEEEE' }
            : { backgroundColor: '#404040' },
        ]}
      >
        {children}
      </MDXText>
    );
  },
  code: ({ children }) => {
    return (
      <MDXText
        style={[
          styles.codeBlock,
          useIsLight()
            ? { backgroundColor: '#EEEEEE' }
            : { backgroundColor: '#404040' },
        ]}
      >
        {children}
      </MDXText>
    );
  },
  pre: ({ children }) => <View style={styles.pre}>{children}</View>,
  ul: ({ children }) => {
    return <View style={[styles.list, styles.listUnordered]}>{children}</View>;
  },
  ol: ({ children }) => {
    return <View style={[styles.list, styles.listOrdered]}>{children}</View>;
  },
  li: ({ children }) => {
    return (
      <View style={styles.listUnorderedItem}>
        <View style={[styles.listItem]}>
          <MDXText>
            <MDXText
              style={{ paddingLeft: 10, paddingRight: 10, fontWeight: 'bold' }}
            >
              {' \u00B7 '}
            </MDXText>
            {children}
          </MDXText>
        </View>
      </View>
    );
  },
  table: ({ children }) => <View style={[styles.table]}>{children}</View>,
  thead: ({ children }) => <View style={[styles.tableHeader]}>{children}</View>,
  tbody: ({ children }) => <View>{children}</View>,
  th: ({ children }) => {
    return <View style={[styles.tableHeaderCell]}>{children}</View>;
  },
  tr: ({ children }) => {
    return <View style={[styles.tableRow]}>{children}</View>;
  },
  td: ({ children }) => {
    return <View style={[styles.tableRowCell]}>{children}</View>;
  },
  hr: ({ children }) => {
    return <View style={[styles.hr]} />;
  },
  br: ({ children }) => <MDXText>{'\n'}</MDXText>,
  img: ({ src, children }) => {
    const { window } = useDimensions();
    return (
      <View style={styles.imageContainer}>
        <AppImage width={window.width * 0.8} source={src} />
      </View>
    );
  },
};

export default AppMDXComponents;
