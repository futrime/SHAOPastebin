<?php
function cook_salt()
{
    $chars = array_merge(range('A', 'Z'), range('a', 'z'), range('0', '9'));
    $str = '';
    for ($i = 0; $i < 4; $i++)
    {
        $str .= $chars[mt_rand(0, count($chars) - 1)];
    }
    return $str;
}
function sendEmail($email,$name,$subject,$text){
	$ch = curl_init();
	 curl_setopt($ch, CURLOPT_URL, 'https://api.sendgrid.com/v3/mail/send');
	 curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
	 curl_setopt($ch, CURLOPT_POST, 1);
	 curl_setopt($ch, CURLOPT_POSTFIELDS,  '{"personalizations": [{"to": [{"email": "'.$email.'"}]}],"from": {"email": "'.EMAIL_ADDRESS.'","name": "'.$name.'"},"subject": "'.$subject.'","content": [{"type": "text/plain", "value": "'.$text.'"}]}');
 
	 $headers = array();
	 $headers[] = 'Authorization: '.SENDGRID_KEY;
	 $headers[] = 'Content-Type: application/json';
	 curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
 
	 $result = curl_exec($ch);
	 if (curl_errno($ch)) {
		 echo 'Error:' . curl_error($ch);
	 }
	 curl_close($ch);
	return $result;
}
