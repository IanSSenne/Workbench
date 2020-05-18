import React, { useState } from 'react';
import { useFirebase } from 'react-redux-firebase';
import { useSelector } from 'react-redux';
import { Card, Classes, Divider } from '@blueprintjs/core';
import HTML from './HTMLRender';
import { useRouter } from 'next/router';
function Bookmark(props) {
	const org = props.org;
	const [, word] = props.book;
	const [dbword, setdbword] = useState();
	const firebase = useFirebase();
	if (!dbword) {
		firebase.ref(`/org/${word.org}/words/${word.word}`).on('value', snapshot => {
			setdbword(snapshot.val());
		});
		return null;
	}
	const router = useRouter();
	return (
		<Card interactive onClick={() => {
			window.location.replace(`/org/${word.org}/view?filter={"term":${JSON.stringify(dbword.word)},"tags":[]}`);
			// router.replace("/org/[org]/view", `/org/${word.org}/view?filter={"term":${JSON.stringify(dbword.word)},"tags":[]}`);
		}}>
			<h1 className={Classes.HEADING}>{dbword.word}</h1>
			<HTML>{dbword.definition}</HTML>
			<Divider />
			<p style={{ color: 'gray' }} className={Classes.SMALL}>
				in {word.org}
			</p>
		</Card>
	);
}
export function Bookmarks({ org }) {
	const firebase = useFirebase();
	const auth = useSelector(state => state.firebase.auth);
	const [bookmarks, setBookmarks] = useState();
	if (!bookmarks) {
		firebase.ref(`users/${auth.uid}/bookmarked`).orderByKey().on('value', snapshot => {
			const bookmarks = snapshot.val() || [];
			setBookmarks(Object.entries(bookmarks));
		});
	}
	return (
		<ul
			style={{
				listStyle: 'none',
				padding: 0
			}}
		>
			{!Boolean(bookmarks) ?
				<li>"loading..."</li>
				: bookmarks.length === 0 ?
					<li>"no bookmarks found."</li>
					: bookmarks.map((_, i) => <li key={i}>
						<Bookmark book={_} org={org} />
					</li>
					)
			}
		</ul>
	);
}
