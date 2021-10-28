<?php


namespace AppBundle\Service;


class UtmHandler
{
    protected $cookieName = '_utmCookie';
    protected $sessionName = '__utmCatalogoSession';

    /**
     * @param string|null $source
     * @param string|null $medium
     * @param string|null $campaign
     * @param string|null $content
     * @param string|null $term
     * @throws \Exception
     *
     * Save utm parameters in session
     */
    public function saveUtm($source = null, $medium = null, $campaign = null, $content = null, $term = null)
    {
        $dataUtm = [
            'utm_source' => $source,
            'utm_medium' => $medium,
            'utm_campaign' => $campaign,
            'utm_content' => $content,
            'utm_term' => $term,
        ];
        if($source != null && $medium != null && $campaign != null) {
            if ((!$this->hasUtm()) || ($this->hasUtm() && mb_strtolower($this->getSource(), 'UTF-8') == 'catalogo' && mb_strtolower($source, 'UTF-8') != 'catalogo')) {
                setcookie($this->cookieName, base64_encode(json_encode($dataUtm)), time() + 3600*48, '/');
                $_SESSION[$this->sessionName] = base64_encode(json_encode($dataUtm));
            } else {
                setcookie('_novalid_'.$this->cookieName, base64_encode(json_encode($dataUtm)), time() + 500, '/');
            }
        }

    }

    /**
     * @return bool
     */
    private function hasUtm()
    {
        if(isset($_COOKIE[$this->cookieName]) || isset($_SESSION[$this->sessionName])) {
            try {
//                $cookie = isset($_COOKIE[$this->cookieName]) ? json_decode(base64_decode($_COOKIE[$this->cookieName]), true) : [];
                $cookie = json_decode(base64_decode($_COOKIE[$this->cookieName]), true);
                $session = isset($_SESSION[$this->sessionName]) ? json_decode(base64_decode($_SESSION[$this->sessionName]), true) : [];
                if(isset($cookie['utm_source']) || isset($session['utm_source'])) {
                    return true;
                }
            } catch (\Exception $e) {}
        } return false;
    }

    /**
     * @return string|null
     * Returns source utm parameter from session
     */
    public function getSource()
    {
        $utms = $this->getUtmParams();
        return isset($utms['utm_source']) ? $utms['utm_source'] : null;
    }

    /**
     * @return string|null
     * Returns medium utm parameter from session
     */
    public function getMedium()
    {
        $utms = $this->getUtmParams();
        return isset($utms['utm_medium']) ? $utms['utm_medium'] : null;
    }

    /**
     * @return string|null
     * Returns campaign utm parameter from session
     */
    public function getCampaign()
    {
        $utms = $this->getUtmParams();
        return isset($utms['utm_campaign']) ? $utms['utm_campaign'] : null;
    }

    /**
     * @return string|null
     * Returns content utm parameter from session
     */
    public function getContent()
    {
        $utms = $this->getUtmParams();
        return isset($utms['utm_content']) ? $utms['utm_content'] : null;
    }

    /**
     * @return string|null
     * Returns term utm parameter from session
     */
    public function getTerm()
    {
        $utms = $this->getUtmParams();
        return isset($utms['utm_term']) ? $utms['utm_term'] : null;
    }

    /**
     * @return array
     * Returns the utm parameters from session
     */
    public function getUtmParams()
    {
        if (isset($_COOKIE[$this->cookieName])) {
            try {
                $utms = json_decode(base64_decode($_COOKIE[$this->cookieName]), true);
                $utms['utm_content'] = isset($utms['utm_term']) ? $utms['utm_content'].' *** '.$utms['utm_term'] : $utms['utm_content'];
                return $utms;
            } catch (\Exception $e) { }
        }
        if (isset($_SESSION[$this->sessionName])) {
            try {
                $utms = json_decode(base64_decode($_SESSION[$this->sessionName]), true);
                $utms['utm_content'] = isset($utms['utm_term']) ? $utms['utm_content'].' *** '.$utms['utm_term'] : $utms['utm_content'];
                return $utms;
            } catch (\Exception $e) { }
        }
        return [];
    }
}