import firebase from 'firebase/app';
import 'firebase/database';
import { useState, useEffect } from 'react';
import { getDatabase, ref, onValue, off } from 'firebase/database';
export const fetchMajors = (onSuccess, onError) => {
    const db = getDatabase();
    const majorsRef = ref(db, 'Majors');

    onValue(majorsRef, (snapshot) => {
        const data = snapshot.val();
        const majorsArray = Object.keys(data).map(key => {
            return { label: data[key].MajorName, value: key };
        });
        onSuccess(majorsArray);
    }, (error) => {
        onError(error);
    });

    // Return a function to unsubscribe from the listener
    return () => off(majorsRef);
};


export const fetchInterests = (onSuccess, onError) => {
    const db = getDatabase();
    const interestsRef = ref(db, 'Interests');

    onValue(interestsRef, (snapshot) => {
        const data = snapshot.val();
        const interestsArray = Object.keys(data).map(key => {
            return { label: data[key].InterestName, value: key };
        });
        onSuccess(interestsArray);
    }, (error) => {
        onError(error);
    });

    // Return a function to unsubscribe from the listener
    return () => off(interestsRef);
};

export const fetchCourses = (onSuccess, onError) => {
    const db = getDatabase();
    const coursesRef = ref(db, 'Courses');

    onValue(coursesRef, (snapshot) => {
        const data = snapshot.val();
        const coursesArray = Object.keys(data).map(key => {
            return { label: data[key].CourseName, value: key };
        });
        onSuccess(coursesArray);
    }, (error) => {
        onError(error);
    });

    // Return a function to unsubscribe from the listener
    return () => off(coursesRef);
};
